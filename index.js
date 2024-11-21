var colors = require("colors");
var axios = require("axios");
var fs = require("fs");
var a = 0;
var readline = require("readline-sync");
const asciiArt = `
  _    _ _ _                                     
 | |  | (_) |                                    
 | |__| |_| |_ ___ _   _  __ _  __ _ _   _  __ _ 
 |  __  | | __/ __| | | |/ _\` |/ _\` | | | |/ _\` |
 | |  | | | |_\\__ \\ |_| | (_| | (_| | |_| | (_| |
 |_|  |_|_|\\__|___/\\__,_|\\__, |\\__,_|\\__, |\\__,_|
                          __/ |       __/ |      
   _____ _     _       _ |___/       |___/ _     
  / ____| |   (_)     (_)   | |           | |    
 | (___ | |__  _ _ __  _  __| | __ _ _ __ | |__  
  \\___ \\| '_ \\| | '_ \\| |/ _\` |/ _\` | '_ \\| '_ \\ 
  ____) | | | | | | | | | (_| | (_| | | | | | | |
 |_____/|_| |_|_|_| |_|_|\\__,_|\\__,_|_| |_|_| |_|

 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 • DEVELOPER : Hitsugaya Shinidanh
 • FACEBOOK : Hitsugaya Shinidanh
 • VERSION : 1.0.1
 • TYPE : Share ảo facebook
`

console.log(asciiArt.bold.Green);

var config = {
  cookies: '',
  id: ''
};
console.log("Nhập cookie facebook: ".bold.Green);
config.cookies = readline.question();
console.log("Nhập id bài viết: ".bold.Green);
config.id = readline.question();
console.log("Nhập số lượt chia sẻ: ".bold.Green);
var shareCount = readline.question();

fs.writeFileSync("./config.json", JSON.stringify(config));
var config = require("./config.json")
require("colors")
var headers = {
  'authority': 'business.facebook.com',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'accept-language': 'en-US,en;q=0.9',
  'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': "Windows",
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'none',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1'
}
class Share {
  getToken() {
    return new Promise((resolve, reject) => {
      headers['cookie'] = config['cookies']
      axios.get('https://business.facebook.com/content_management', {
        headers: headers
      }).then(res => {
        var accessToken = 'EAAG' + res.data.split('EAAG')[1].split('","')[0]
        resolve({
          accessToken: accessToken,
          cookie: headers['cookie']
        })
      }).catch(err => {
        reject(err)
      })
    })
  }
  share(token, cookie) {
    delete headers.authority;
    delete headers.accept;
    delete headers['accept-language'];
    headers['accept-encoding'] = 'gzip, deflate';
    headers['host'] = 'graph.facebook.com'
    headers['cookie'] = cookie
    var count = 0;
    setInterval(function() {
      axios({
        method: 'POST',
        url: `https://graph.facebook.com/me/feed?link=https://m.facebook.com/${config['id']}&published=0&access_token=${token}`,
        headers: headers
      }).then(res => {
        console.log(`[ ${a++} ] - `.bold.Green + `${res.data.id}`.bold.Green)
        count++;
        /*if (count === shareCount) {
           console.log("Successful");
           clearInterval(interval);
        }*/
      }).catch(err => {
        console.log("[ LỖI ]:".bold.Red + "Không share được!".bold.Red)
      })
    }, 1000)
  }
}
const test = new Share();
test.getToken().then(res => {
  var access_token = res['accessToken'], cookie = res['cookie'];
  test.share(access_token, cookie)
})
