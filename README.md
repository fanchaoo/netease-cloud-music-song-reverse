# netease-cloud-music-song-reverse
网易云音乐歌单倒序播放

```
思路：
把某个歌单的歌曲倒序后，添加到另外一个新歌单里面（新歌单的原有歌曲会被清除）
```

1. 下载并启动 https://github.com/Binaryify/NeteaseCloudMusicApi 项目
2. 进入NeteaseCloudMusicApi项目，将songReverse.js拷贝到NeteaseCloudMusicApi项目的test目录中
3. 修改下面4个配置项：
```
const phone = '15733100700';            // 手机号
const password = '123';                 // 密码
const inputName = 'fanchaoo喜欢的音乐';  // 源歌单名称
const outputName = '我喜欢的音乐-倒序';   // 新歌单名称（须人工提前建立好）
```
