const request = require('request');
const util = require('util');
const requestPromise = util.promisify(request);
const host = global.host || 'http://localhost:3000';

let phone = '';
let password = '';
let inputName = 'fanchaoo喜欢的音乐';
let outputName = '我喜欢的音乐-倒序';
let cookie = '';
let userId = null;

async function querySongId(playListId) {
  let playListDetailBody = (await requestPromise({
    url: `${host}/playlist/detail`,
    qs: {
      id: playListId
    },
    headers: {
      cookie: cookie
    }
  })).body;
  console.log(playListDetailBody);
  playListDetailBody = JSON.parse(playListDetailBody);
  return playListDetailBody.playlist.trackIds.map(x => x.id);
}

(async function () {

  if (!cookie || !userId) {
    // 登录
    let loginBody = (await requestPromise({
      url: `${host}/login/cellphone`,
      qs: {
        phone: phone,
        password: password
      }
    })).body;
    console.log(loginBody);
    loginBody = JSON.parse(loginBody);
    cookie = loginBody.cookie;
    userId = loginBody.profile.userId;
  }

  // 获取歌单列表
  let playListBody = (await requestPromise({
    url: `${host}/user/playlist`,
    qs: {
      uid: userId
    },
    headers: {
      cookie: cookie
    }
  })).body;
  console.log(playListBody);
  playListBody = JSON.parse(playListBody);

  let inputId = null;
  let outputId = null;
  for (let i in playListBody.playlist) {
    if (!inputId && playListBody.playlist[i].name === inputName) {
      inputId = playListBody.playlist[i].id;
    }
    if (!outputId && playListBody.playlist[i].name === outputName) {
      outputId = playListBody.playlist[i].id;
    }
  }
  if (!inputId || !outputId) {
    console.log('inputId或outputId未找到', inputId, outputId);
    return;
  }

  // 获取歌单详情
  let inputSongIdList = await querySongId(inputId);
  console.log(inputSongIdList);
  let outputSongIdList = await querySongId(outputId);
  console.log(outputSongIdList);

  // 对歌单删除歌曲
  let tracksBody;
  if (outputSongIdList && outputSongIdList.length > 0) {
    tracksBody = (await requestPromise({
      url: `${host}/playlist/tracks`,
      qs: {
        op: 'del',
        pid: outputId,
        tracks: outputSongIdList.join(',')
      },
      headers: {
        cookie: cookie
      }
    })).body;
    console.log(tracksBody);
  }

  // 对歌单删除歌曲
  if (inputSongIdList && inputSongIdList.length > 0) {
    tracksBody = (await requestPromise({
      url: `${host}/playlist/tracks`,
      qs: {
        op: 'add',
        pid: outputId,
        tracks: inputSongIdList.join(',')
      },
      headers: {
        cookie: cookie
      }
    })).body;
    console.log(tracksBody);
  }

})();


