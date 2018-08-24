import { preSetMood } from "../actions/mood";
import {
  normalize,
  percentagify,
  toneHash,
  newMinMax
} from "../actions/helper";
import "antd/dist/antd.css";
import { USER_TONE_DEFAULT } from "../const/emotes";

import { access } from "fs";

import { RANGE } from "../const/emotes";

const messageCountLimiter = input => {
  input.splice(5, input.length);
  return input;
};

function getText(input, text) {
  const msgArr = [];
  messageCountLimiter(input);

  for (let i = 0; i < input.length; i++) msgArr.push(input[i][text]);
  let textOutput = msgArr.join(". ");
  return textOutput;
}

/* convert fetched data from firebase to string and correct text format,
also set paramaters for analyzer tone. only document level. */
export const convertText = (data, roomName) => {
  const uid = data.senderId;
  const room = roomName;
  let textOutput = {
    tone_input: { text: getText(data.msgData, "text") },
    content_type: "application/json",
    senderId: uid,
    room: room
  };
  //console.log(textOutput);
  return getToneAnalysis(textOutput);
  //setToneParams(textOutput);
};

const getToneAnalysis = text => {
  let params = {
    method: "POST",
    body: JSON.stringify(text),
    headers: {
      "content-type": "application/json"
    }
  };
  console.log(params);
  fetch(`/api/tone`, params)
    .then(response => response.json())
    .then(data => {
      toneDataCallback(data);
    })
    .catch(err => {
      console.log(err);
    });
};

/* use data from Watson, convert to 'useful' 
data to be sent into state */
const toneDataCallback = toneData => {
  let data = toneData.data;
  const emotionMap = item => {
    var v1 = percentagify(item.score);
    var v2 = percentagify(RANGE[0]);
    var v3 = percentagify(RANGE[1]);

    /* reuse origin param, avoid js math mutate */
    return {
      tone: item.tone_name,
      score: newMinMax(percentagify(item.score)),
      likeliness: v1 > v3 ? "VERY LIKELY" : v1 > v2 ? "LIKELY" : "UNLIKELY"
    };
  };

  let sentences = [];
  let sentenceTone = [];
  let emotionTone = data.document_tone.tones.slice(0);
  if (
    typeof data.sentences_tone === "undefined" ||
    data.document_tone === "undefined" ||
    data.document_tone === null ||
    data.sentences_tone === null
  ) {
    console.log("no tone");
  }

  //What to do when no dominant tones returned
  if (
    (data.document_tone.tones === null ||
      data.document_tone.tones.length === 0) &&
    (sentenceTone === null || sentenceTone.length === 0)
  ) {
    console.log("no tone");
  }

  // if only one sentence, sentences will not exist, so mutate sentences_tone manually
  if (
    typeof data.sentences_tone === "undefined" ||
    data.sentences_tone === null
  ) {
    sentences = [
      {
        sentence_id: 0,
        tones: data.document_tone.tones.slice(0)
      }
    ];
  } else {
    //Deep copy data.sentences_tone
    sentences = JSON.parse(JSON.stringify(data.sentences_tone));
  }

  //Populate sentencesTone with all unique tones in sentences, to be displayed in sentence view
  sentences.forEach(elements => {
    elements.tones.forEach(item => {
      if (
        sentenceTone[item.tone_id] == null ||
        sentenceTone[item.tone_id].score < item.score
      ) {
        sentenceTone[item.tone_id] = item;
      }
    });
  });
  sentenceTone = Object.keys(sentenceTone)
    .sort()
    .map(function(obj) {
      return sentenceTone[obj];
    });
  emotionTone = emotionTone.map(emotionMap);
  sentenceTone = sentenceTone.map(emotionMap);
  // console.log(
  //   "emotone:",
  //   emotionTone,
  //   " sentone:",

  //   sentenceTone,
  //   " sender:",
  //   toneData.senderId,
  //   " room:",
  //   toneData.room
  // );
  let emotionPacket = {
    docTone: emotionTone,
    sentenceTone: sentenceTone,
    senderId: toneData.senderId,
    room: toneData.room
  };
  averageTone(emotionPacket);
  return emotionPacket;
};

const averageTone = processedTone => {
  let docTone = processedTone.docTone;
  let sentenceTone = processedTone.sentenceTone;
  let senderId = processedTone.senderId;
  let room = processedTone.room;
  let toneArrCombine = docTone.concat(sentenceTone);

  /**combine array */
  const toneArrReduce = toneArrCombine.reduce((obj, item) => {
    obj[item.tone] = obj[item.tone] || [];
    obj[item.tone].push(item.score);
    return obj;
  }, {});
  /**group tones */
  let toneGroup = Object.keys(toneArrReduce).map(key => {
    return { tone: key, score: toneArrReduce[key] };
  });
  /**average repeated tones */
  toneGroup.forEach(i => {
    if (i.score.length > 1) {
      let sum = i.score.reduce((prev, curr) => (curr += prev));
      let avg = sum / i.score.length;
      return (i.score = avg);
    } else {
      let score = i.score;
      return (i.score = Number(score));
    }
  });
  //console.log(toneGroup);
  //setMoodState(toneGroup);
  /**match to default, to update documentlevel score */
  let updateDefaultTone = USER_TONE_DEFAULT;
  toneGroup.forEach(e => {
    updateDefaultTone.forEach(i => {
      if (i.tone == e.tone) {
        i.score = e.score;
      }
    });
  });
  console.log(updateDefaultTone);
  preSetMood(updateDefaultTone);
};
