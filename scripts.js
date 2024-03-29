console.log('Script file executed.'); // 最初の行にこのコードを追加する
/**/
document.addEventListener('DOMContentLoaded', () => {
  console.log('Script loaded and ready.');

  if (!window.location.pathname.includes("Extra.html")||!window.location.pathname.includes("novel.html")||!window.location.pathname.includes("works.html")) {
    const paragraphs = document.querySelectorAll('.novel p');
    const targetElements = document.querySelectorAll('.intro h1');

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const paragraphObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const paragraph = entry.target;

          paragraph.innerHTML = paragraph.textContent.split('').map(char => `<span>${char}</span>`).join('');

          const spans = paragraph.querySelectorAll('span');
          spans.forEach((span, index) => {
            const baseDelay = 175;
            const randomDelay = Math.floor(Math.random() * baseDelay);

            setTimeout(() => {
              span.style.opacity = '1';
            }, 500 + baseDelay * index + randomDelay);
          });

          observer.unobserve(paragraph);
        }
      });
    }, options);

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;

          target.style.animation = "fade-in 2s ease-in forwards";

          observer.unobserve(target);
        }
      });
    }, options);

    paragraphs.forEach(paragraph => {
      paragraphObserver.observe(paragraph);
    });

    targetElements.forEach(target => {
      fadeInObserver.observe(target);
    });


  }

  // 現在のページがnovel.htmlであるかを確認
  if (window.location.pathname.includes("novel.html")) {
    console.log(Path);
    const text = document.querySelector("#honbun p")
    const title = document.querySelector(".novel-title h1")
    const chapterselector = document.querySelector("#chapter")
    const wordcount = document.querySelector("h5");

    // novel.htmlが読み込まれたときに実行したいJavaScriptのコードを書く
    console.log('novel.htmlが読み込まれました！');
    const xhr = new XMLHttpRequest();
    const urlParams = new URLSearchParams(window.location.search);
    Path = urlParams.get('title');
    if (Path.split("_")[1] == "あとがき") {
      title.textContent = "あとがき"
      if(window.innerWidth<=500)
      title.style = "font-size: 1.2rem;"
      const topic_novel = document.getElementById("novelListItem")
      const topic = document.querySelector(".topic-path")
      const here = document.createElement("li");
      const href = document.createElement("a");
      href.href = "#";
      href.textContent = "P.S.";
      here.appendChild(href);
      topic.appendChild(here);

      topic_novel.href = "novel.html?title=" + Path.split("_")[0];
    } else {
      title.textContent = "";
    }
    title.textContent += "「" + Path.split("_")[0] + "」";
    const filePath = Path + ".txt";
    text.textContent = "";
    xhr.open("GET", filePath, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // ファイルの中身を取得して表示
        let fileContent = xhr.responseText;
        fileContent = fileContent.split(/[$,()]/);

        //console.log(fileContent);
        const br = document.createElement("br");
        for (let i = 0; i < fileContent.length; i++) {
          const charNode = document.createTextNode(fileContent[i]);
          if (charNode.textContent.includes("#")) {
            const str_ = charNode.textContent.split("#");
            var str = charNode.textContent.split("#");
            var Node = document.createTextNode(str[0]);
            text.appendChild(Node);
            var index = 1;
            do {
              var str2 = str_[index]
              str = str_[index].split(/\r\n|\r|\n/)[0];
              str2 = str2.replace(str, "");
              Node = document.createTextNode(str);
              const j_Node = document.createElement("p");
              j_Node.id = str;
              j_Node.className = "novel-chapter";
              j_Node.appendChild(Node);
              if(str[0]=="!"){
                j_Node.textContent = "";
                text.appendChild(j_Node);
              }else{
              text.appendChild(j_Node);
              text.appendChild(document.createElement("br"));
              }
              Node = document.createTextNode(str2);
              //console.log(Node.textContent);
              text.appendChild(Node);
              //text.appendChild(Node);
              const chapter = document.createElement("option");
              chapter.text = str.replace("!","");
              chapter.value = str;
              chapterselector.appendChild(chapter);
              index++;
            } while (str_.length > index);
            continue;
          }
          if (i % 3 == 0) {
            text.appendChild(charNode);
            //console.log(fileContent[i]);
          } else if (i % 3 == 1) {
            const rb = document.createElement("ruby");
            rb.appendChild(charNode);
            i++;
            const rt = document.createElement("rt");
            const charNode2 = document.createTextNode(fileContent[i]);
            rt.appendChild(charNode2);
            rb.appendChild(rt);
            text.appendChild(rb);
          }
        }

        if (Path.split("_").length == 1) {
          const after = document.createElement("a");
          after.textContent = "あとがきへ";
          after.href = "novel.html?title=" + Path + "_あとがき";
          after.style = "color: blue;position: absolute;bottom: 0;text-decoration: overline;text-decoration-thickness: 1px;";

          text.appendChild(document.createElement("br"));
          text.appendChild(after);
        }

        text.appendChild(document.createElement("br"));
        text.appendChild(document.createElement("br"));
        text.appendChild(document.createElement("br"));
        wordcount.textContent += text.textContent.length + "文字";
        console.log(chapterselector.length);
        if (chapterselector.length == 1) {
          chapterselector.parentNode.style.display = "none";
        }
      } else if (xhr.readyState == 4 && xhr.status == 404) {

        chapterselector.parentNode.style.display = "none";
        if (Path.split("_")[1] == "あとがき") {
          text.appendChild(document.createTextNode("あとがきが用意されていないか、"));

        }
        text.appendChild(document.createTextNode("エラーです。再度お試しください。"));

      }
    };
    xhr.send();
    const comment_type = document.querySelector("#type");
    comment_type.value = encodeURI(Path.split("_")[0]);
  }
  if(window.location.pathname.includes("Extra.html")){
          // 星を表示するための親要素を取得
  const stars = document.querySelector(".status");

  // 星を生成する関数
  const createStar = () => {
    const starEl = document.createElement("div");
    starEl.className = "star";
    const minSize = 1; // 星の最小サイズを指定
    const maxSize = 2.5; // 星の最大サイズを指定
    const size = Math.random() * (maxSize - minSize) + minSize;
    starEl.style.width = `${size}px`;
    starEl.style.height = `${size}px`;
    starEl.style.left = `${Math.random() * 100}%`;
    starEl.style.top = `${Math.random() * 100}%`;
    starEl.style.animationDelay = `${Math.random() * 10}s`;
    stars.appendChild(starEl);
  };

  // for文で星を生成する関数を指定した回数呼び出す
  for (let i = 0; i <= 200; i++) {
    createStar();
  }
  }
});

// 選択されたオプションに基づいてターゲットにスクロール
function scrollToTarget(selectElement) {
  var targetId = selectElement.value;

  if (targetId) {
    var targetElement = document.getElementById(targetId);

    if (targetElement) {
      // スクロール後に画面幅が768以下ならさらにスクロール
      setTimeout(function () {
        if (window.innerWidth <= 768) {
          console.log('画面幅が768以下なのでさらにスクロールします。');
          var titleElement = document.getElementById('novel-title');
          if (titleElement) {
            titleElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 600); // 500ミリ秒待機 (調整可能)
      // ターゲットが存在する場合はスクロール
      targetElement.scrollIntoView({ behavior: 'smooth' });


    }
  }
}
const content = document.querySelector('.novel-container');
if (content) {
  // カーソルが要素内に入ったらイベントリスナを追加
  content.addEventListener('mouseenter', () => {
    document.addEventListener('wheel', handleWheel, { passive: false });
  });

  // カーソルが要素から出たらイベントリスナを削除
  content.addEventListener('mouseleave', () => {
    document.removeEventListener('wheel', handleWheel);
  });

  // マウスのスクロールイベントを処理する関数
  function handleWheel(event) {
    // マウスのスクロールイベントを検知してX方向にスクロール
    console.log(content.scrollLeft)
    console.log()
    if (content.scrollLeft == 0 & event.deltaY < 0) {
    } else if (event.deltaX != 0) {
      content.scrollLeft += event.deltaY;
    }else {
      event.preventDefault(); // デフォルトのスクロール動作を無効にする
      content.scrollLeft -= event.deltaY;
    }
  }

}


let Path;

// リンクがクリックされたときに実行される関数
function setPath(event) {
  // イベントのデフォルト動作を防ぐ（新しいページへの遷移をキャンセル）
  event.preventDefault();
  const h1Text = event.currentTarget.querySelector('h1').textContent;
  // クリックされたリンク内のh1要素のテキストを取得し、Pathに代入
  // ローカルストレージにデータを保存
  window.location.href = 'novel.html?title=' + encodeURIComponent(h1Text);
  // 1000ミリ秒（1秒）待機する例
  // Pathの値をコンソールに表示（確認用）
}


var showOnlyThree = true;

function toggleItems(containerId) {
  var container = document.getElementById(containerId);
  var liElements = container.querySelectorAll('li');
  var button = container.querySelector('.moreDisp');
  liElements.forEach(function (li, index) {
    if (button.innerHTML === 'もっと見る') {
      console.log('showing item ' + index)
      li.style.display = 'block';
    } else {
      console.log('hiding item ' + index)
      if (index > 2)
        li.style.display = 'none';
    }
  });
  if (button.innerHTML === '閉じる') {
    var targetElement = document.getElementById(containerId);
    //targetElement.scrollIntoView({ behavior: 'smooth' });
    button.innerHTML = 'もっと見る';
  } else {
    button.innerHTML = '閉じる';
  }

  showOnlyThree = !showOnlyThree;
}

if (window.location.pathname.includes("Extra.html") || window.location.pathname.includes("novel.html")) {
  var submitted = false;
  var NGComments = ["死ね", "バカ", ".exe"]; // 簡易的なNGワードの設定
  var regex = new RegExp(NGComments.join("|"));
  function test(wcheck) {
    if (wcheck.match(regex) != null) {
      alert("ERROR: コメントにNGワードが含まれています");
      return false;
    }
    document.getElementById("submitbutton").disabled = true;
    textareas = document.getElementsByTagName('textarea');
    for (var i = 0; i < textareas.length; i++) {
      textareas[i].value = textareas[i].value.replace(/</g, '&lt;');
    }
    inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = inputs[i].value.replace(/</g, '&lt;');
    }
    return submitted = !0;
  }
  const urlParams = new URLSearchParams(window.location.search);
  Path = urlParams.get('title');
  if (Path == null) {
    Path = "Extra";
  }
  console.log(Path);
  d3.csv(`https://docs.google.com/spreadsheets/d/1UBMITcn7U6nmls5DLRbdjvdXgpXr5A-qOFp0ONVdRrg/export?format=csv&range=A3:D`, function (error, data) {

    var text = "<ul>";
    var index = 0;
    for (var i = data.length - 1; i > 0; i--) {
      if (data[i].Type != encodeURI(Path.split("_")[0])) {
        continue;
      }
      index++;
    }
    if (index == 0) {
      text += "<li>コメントはまだありません</li>";
    } else {
      for (var i = data.length - 1; i > 0; i--) {
        if (data[i].Type != encodeURI(Path.split("_")[0])) {
          continue;
        }
        text += "<li>" + index + " 名前: " + data[i].Name + " " + data[i].Timestamp + "<pre>" + data[i].Comments + "</pre></li>";
        index--;
      }
    }
    text += "</ul>";
    d3.select("#comments").html(text);
  });
}
// 文章データを格納
const textData = [

  [
    "嘘は苦手だ",
    "ここは星のないソラ",
    "雨の降る夜に、傘を差さず",
    "「いい気はしないね、ひとごろし」",
    "その航路に意味はない、その情動に価値はない",
    "醒める夢",
    "跳ねた心に火が灯る",
    "何かをすれば好転する、なんてのは幻想だ。",
    "影に呑まれそうな足は前へと",
    "ここにはきっと何もない",
    "煩悩がお釈迦になった！",
    "知らないことは幸せなこと",
    "とっくに壊れたガラクタを未だ抱いて生きている。",
    "最善は尽くした、そのはずである",
    "震える指、途切れる呼吸、見据えた瞳孔。",
    "舌触りに不快感"
    // ...
  ],
  [
    "「意味なんて、ないんだね」",
    "「じゃあ、夏が好きってことで」",
    "「私、あなたのことが好きなのかもしれないわ」",
    "「やっぱり卒業って寂しいね」",
    "「うん、何だか満足よ」",
    "「悲しいけれど、これが現実」",
    "「だって、理解できないものは怖いからね」",
    "「人は独りで生きていけると思う？」",
    "「はは。揚げ足取りですか、それ」",
    "「先輩、ずっと辛かったんでしょう？」",
    "「ひゅー頼もしー！　じゃ前衛よろしくね！」",
    "「ふうん、君にしてはつまらない答えだね」",
    "「おっと、バレちゃった」",
    "「あれ初犯じゃなかったんですか」",
    "「ん。それは全く以て、辛く正しい言葉だね」",
    "「恥ずかしい話、甘えてたんだよ」"
  ],
  [
    "「別れはいつか訪れるもの」",
    "「またね、にも終わりがくるでしょう？」",
    "「いやあ。やっぱり駄目だろ、君」",
    "「そんな些事」",
    "「なんてこった、終わりだね」",
    "「どっと疲れたよ。眠たいな」",
    "「いや、そこは諦めないで欲しいけど」",
    "「優しさとかいう自己陶酔ね」",
    "「ピンポン正解！」",
    "「別に、どうも」",
    "「何もしなければ、よかったんだ」",
    "「イカれてんなぁ？！」",
    "「あ、そういうのいいんで」",
    "「人困らせて楽しいか？」",
    "「黙って帰って寝てどうぞ」",
    "「惜しい。一手差でボクの勝ちだ」"
  ]
];

let currentTextIndex = 0;

function updateText(paragraphs, newTextArray) {
  paragraphs.forEach((paragraph, index) => {
    // 新しいテキストを設定
    paragraph.textContent = newTextArray[index];

    // 文字の表示アニメーションをリセット
    paragraph.innerHTML = paragraph.textContent.split('').map(char => `<span style="opacity: 0">${char}</span>`).join('');

    // 文字を再びアニメーション表示
    const spans = paragraph.querySelectorAll('span');
    spans.forEach((span, index) => {
      const baseDelay = 175; // 基本遅延（ミリ秒）
      const randomDelay = Math.floor(Math.random() * baseDelay); // ランダムな遅延を計算

      setTimeout(() => {
        span.style.opacity = '1'; /* 透明度を変更してテキストを表示 */
      }, 500 + baseDelay * index + randomDelay);
    });
  });
}

// ボタンのクリックイベントリスナーを追加
if (!window.location.pathname.includes("Extra.html")||!window.location.pathname.includes("novel.html")||!window.location.pathname.includes("works.html")) {

  document.getElementById('changeText').addEventListener('click', () => {
    // 文章を切り替える
    console.log('ボタンがクリックされました。');
    var paragraphs = document.querySelectorAll('.novel p');
    currentTextIndex = (currentTextIndex + 1) % textData.length;
    updateText(paragraphs, textData[currentTextIndex]);
  });


  // 初期状態の文章を設定

  const square = document.getElementById("square");
  function pauseAllSquareAnimations() {
    const squares = document.querySelectorAll(".square");

    squares.forEach((square) => {
      square.style.animationPlayState = "paused";
    });
  }
  function startAllSquareAnimations() {
    const squares = document.querySelectorAll(".square");

    squares.forEach((square) => {
      square.style.animationPlayState = "running";
    });
  }

  /*square animation
  square.addEventListener("click", () => {
      const squareAnimation = square.style.animation;
      const buttonText = square.textContent;
  
      if (buttonText === "STOP") {
          pauseAllSquareAnimations()
          square.textContent = "START";
      } else {
          startAllSquareAnimations()
          square.textContent = "STOP";
      }
  });
  */
  //テキストアニメーション
  const CLASSNAME = "-visible";
  const TIMEOUT = 2500;
  const target = document.querySelector(".title");

  setInterval(() => {
    target.classList.add(CLASSNAME);
    setTimeout(() => {
      target.classList.remove(CLASSNAME);
    }, TIMEOUT);
  }, TIMEOUT * 2);

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function (event) {
        var href = this.getAttribute("href");

        if (href.indexOf("http") === 0 || href.indexOf("//") === 0 || href.indexOf("#") !== 0) {
          return;
        }

        event.preventDefault();
        var target = document.querySelector(href);

        if (target) {
          var targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
          var startPosition = window.pageYOffset;
          var distance = targetPosition - startPosition;
          var startTime = null;
          var scrollDuration = 5; // スクロールにかかる時間をミリ秒単位で定義

          function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            var timeElapsed = currentTime - startTime;
            var progress = Math.min(timeElapsed / scrollDuration, 0.01);
            window.scrollTo(0, startPosition + distance * progress);
            if (progress < 1) {
              requestAnimationFrame(animation);
            }
          }

          requestAnimationFrame(animation);
        }
      });
    });
  });
}
function downloadTextFile() {
  // textareaからテキストを取得
  const textToSave = document.getElementById('inputText').value;
  // Blobオブジェクトを作成し、テキストデータを格納
  const blob = new Blob([textToSave], { type: 'text/plain' });
    // 現在時刻を取得してフォーマット
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');

    const timestamp = `${year}${month}${day}/${hour}${minute}`;
  // a要素を作成し、BlobオブジェクトをURLに変換してダウンロードリンクを生成
  const a = document.createElement('a');
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = `output_${timestamp}.txt`;
  console.log(blob)

  // a要素をクリックしてダウンロードを実行
  document.body.appendChild(a);
  a.click();

  // 不要な要素を削除してURLオブジェクトを解放
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", function () {
  var moreButtons = document.querySelectorAll(".more");

  moreButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var txtHide = button.parentElement.previousElementSibling;

      button.classList.toggle("on-click");

      if (txtHide.style.display === "none" || !txtHide.style.display) {
        txtHide.style.display = "block";
        var height = txtHide.scrollHeight;
        txtHide.style.height = 0;
        txtHide.style.overflow = "hidden";

        setTimeout(function () {
          txtHide.style.transition = "height 1000ms";
          txtHide.style.height = height + "px";
        }, 0);

        setTimeout(function () {
          txtHide.style.removeProperty("height");
          txtHide.style.removeProperty("overflow");
          txtHide.style.removeProperty("transition");
        }, 1000);
      } else {
        txtHide.style.height = txtHide.scrollHeight + "px";
        txtHide.style.overflow = "hidden";
        txtHide.style.transition = "height 1000ms";

        setTimeout(function () {
          txtHide.style.height = 0;
        }, 0);

        setTimeout(function () {
          txtHide.style.display = "none";
          txtHide.style.removeProperty("height");
          txtHide.style.removeProperty("overflow");
          txtHide.style.removeProperty("transition");
        }, 1000);
      }
    });
  });
});

function bounceAnimation() {
  const headerText = document.getElementById("header-text");
  const characters = headerText.querySelectorAll("span");

  characters.forEach((character, index) => {
    character.style.animation = "";
    setTimeout(() => {
      character.style.animation = "bounce 1s ease-in-out";
    }, 100 * index);
  });
}

    function Wheel(event) {
      event.preventDefault();
      console.log('スクロールされました');
    }
if (!window.location.pathname.includes("Extra.html")||!window.location.pathname.includes("novel.html")||!window.location.pathname.includes("works.html")) {

  console.log('ロードされました');
  if (sessionStorage.getItem('animationExecuted') === null) {
    document.addEventListener('wheel', Wheel, { passive: false });

    console.log('runします');
    var textarea = $('.term');
    var typingSpeed = 70; // Typing speed in milliseconds
    var scrollSpeed = 0.000000000000000000001; // Scroll speed factor
    var text = 'sh Bunjin_toYodo.sh';
    var animationExecuted = false;
    var i = 0;
    var k = Math.floor(Math.random() * 2);
    runner();
    // アニメーションが実行された後、セッションストレージに記録
    sessionStorage.setItem('animationExecuted', 'true');
  } else {
    console.log('runしません');
    $(".load").fadeOut(0);
  }
}

function runner() {
  textarea.append(text.charAt(i));
  i++;
  setTimeout(
    function () {
      if (i < text.length)
        runner();
      else {
        textarea.append("<br>")
        i = 0;
        setTimeout(function () { feedbacker(); }, 800);
      }
    }, typingSpeed);
    
}

var count = 0;
var time = 1;
function feedbacker() {
  var mynus = 0;

  if (k == 1) { mynus = 1; scrollSpeed = 3; } else { mynus = 0 }
  for (var j = 0; j < 4 - mynus && i + 1 < output[k].length; j++) {
    i++;
    textarea.append("[" + count / 500 + "] " + output[k][i] + "<br>");
  }



  // 自動スクロールの実装を更新
  var termWrapper = $('.term-wrapper');
  termWrapper.scrollTop(termWrapper.prop('scrollHeight'));

  i++;
  time = Math.floor(Math.random() * 4) + 1;
  count += time;
  setTimeout(
    function () {
      if (i < output[k].length - 2){
        feedbacker();
        //Here
        

      }
      else {
        textarea.append("<span style='color:red'>...Connected!</span><br>");
        setTimeout(function () {
            $('html, body').animate({ scrollTop: 0 },0);
          $(".load").fadeOut(2200);

        }, 1100);
          document.removeEventListener('wheel', Wheel);
          console.log('スクロールを解除しました');
      }
      
    }, time * scrollSpeed);

}


var output2 = ["くだらない、くだらない。",
  "世界はすべてくだらない。",
  "踊るように、舞うように。",
  "クルクルクルクル私は謳う。",
  "つまらない、味気ない、見ていられない、意味がない。",
  "それは真理。",
  "おかしいの、みっともないのに、生きてるなんて。",
  "離れたところで見下して、そうしていつもひとり勝ち。",
  "偉ぶっているやつも、落ちこぼれてしまったやつも、結局何も変わらない。",
  "だってあなたたち終わるじゃない。",
  "みんなみんな、絶対に。",
  "意味なんて何も残らないのに、どうしてそんなに必死なの。",
  "価値なんて薄れて消えるのに、どうしてそこまで躍起なの。",
  "あはははは、ばかみたい。",
  "きっと、どこかくるっているのね。",
  "これ以上なく哀れだわ。",
  "涙を流して、命に縋って、何になるというのでしょう。",
  "そこには常に、終わりがあるのに。",
  "クルクルクルクル私は回る。",
  "流れる曲はメヌエット。",
  "これ以外は好きじゃない。",
  "私と同じ名のこれくらいしか、私は贔屓していない。",
  "世界を観て、嘲って。",
  "私は笑って悦に浸る。",
  "あはは、ほんとにおかしいの。",
  "いつまでだって、飽きないわ。",
  "床に臥せった病人も、誰もが羨む有名人も、大して違いもないのに差をつけて。",
  "悔しがって、誇らしがって。",
  "滑稽。",
  "したくもなさそうな愛想笑いがそんなに楽しい？嘘をついて馴れ合ってまで居場所が欲しい？才能無いこと続けて、夢ばかり見ているの面白い？あなたたち、思っていることとやってること、たいてい逆ね。",
  "笑えるわ。",
  "短い時間、そんなことに使っていていいのかしら。",
  "救えない。",
  "くだらない、つまらない、くるっている、ばからしい。",
  "いつもの通り思うまま。",
  "何回目かのそのひとつ。",
  "ずっと流れていた、メヌエットが、止んだ。",
  "なるほど、世界が終わったらしい。",
  "呆気のない終わりだった。",
  "ふーん、そう。",
  "そうなのね。",
  "終わっちゃったのね、まあいいわ。",
  "白紙みたいで、つまらない。",
  "いつも誰かが弾いていたメヌエットはもう流れない。",
  "世界が終わることは知っていたはずだけど、ちょっと困った。",
  "何もないのは、寂しいものね。",
  "そうだ、自分で弾けばいいじゃない。",
  "すぐに出来るわ、そのくらいなら。",
  "すぐにピアノを用意して、そこにそっと指を乗せる。",
  "押し込めば音が鳴る。",
  "とても単純。",
  "でも、どうすればメヌエットになるかしら。",
  "分からないなら試してみよう。",
  "他にやることもないのだし。",
  "白の鍵を適当に押す。",
  "すると低めの音が鳴る。",
  "なんだかちょっと面白い。",
  "すべての音を鳴らしていって、知っている音を増やしていく。",
  "どこを押せばどの音が鳴るか、次第に分かるようになる。",
  "記憶の中のメヌエットを思い出して、それと同じ音を弾いてみよう。",
  "始めは人差し指だけで、拙いながらも丁寧に。",
  "それにもやがて慣れてきた。",
  "今度は人差し指だけでなく、指のすべてを躍らせる。",
  "ゆっくり、じっくり、馴染ませて。",
  "そうしてメヌエットを編んでいく。",
  "単調な音の連なりに抑揚をつける。",
  "リズムを取ってみたりして。",
  "情緒を持たせるために、鍵盤に激しく打ち込んで。",
  "何度も何度も繰り返す。",
  "幾星霜そうしていて、やっとメヌエットが流れ始める。",
  "前に流れていたものと、まったく同じその音色。",
  "ああ、これよこれ。",
  "長くご無沙汰だったけど、遂にやってやったわ！通して一度弾いてみる。",
  "心地の良い達成感。",
  "これまでの苦労もなんのその。",
  "弾き飛ばしてよメヌエット。",
  "左と右の指を操って。",
  "音は軽快。",
  "気分は爽快。",
  "それは何にも勝る喜びで、大きく大きく笑みが零れる。",
  "自分で弾くのも楽しいものね。",
  "いつまでだって、続けられそう。",
  "愉快になって長々と。",
  "ずいぶん弾いていたけれど、何故だか少し物足りない。",
  "不思議に思って記憶を覗けば、抜け落ちていたのは躍動だった。",
  "困ったわ。",
  "これじゃあちっとも動けない。",
  "ピアノを弾きながら、踊るなんて。",
  "どう考えてもできやしない。",
  "困ってしまって途方に暮れる。",
  "どうやらここで行き止まり。",
  "あーあ。",
  "つまらない。",
  "ぽんと押したらピアノも嘆いた。",
  "突然思い出したけど、終わった世界は戻ってこない。",
  "あのくだらない世界でも、無くなっては困りもの。",
  "そう思うと恋しくなって、ちょっといじけて下を向く。",
  "あ、ならつくってしまえばいいじゃない。",
  "名案ね！跳ねるように立ち上がる。",
  "人差し指を横に振って、一本真っ直ぐ線を引く。",
  "それを始まりとして、世界をひとつ、つくり始める。",
  "もう一度、メヌエットを流すために。",
  "それはひどく単純な作業。",
  "初めの線を球にして、必要なものを足していく。",
  "前の世界に近づけるために、良いも悪いも一緒くた。",
  "なんでもかんでも素にする。",
  "捏ねて混ぜて伸ばして薄めて、世界はそうしてつくられる。",
  "なかなかな出来ね。",
  "悪くないわ。",
  "初めてにしては良い出来でなんだかちょっと誇らしい。",
  "せっかくだから、この世界はメヌエット。",
  "そう名付けることにした。",
  "そのための世界だし、ぴったりね。",
  "あとは待つだけ、メヌエットが流れるまで。",
  "でもそれだけはつまらないから、鍵盤を弾いて眺めてる。",
  "たいへんそうな命たち。",
  "汗水たらして働いて、前見たときと様子が違う。",
  "ふうん。",
  "ずっと同じことをしているようで、少し違うのね、あなたたち。",
  "まだまだ当分、メヌエットは流れそうにない。",
  "悟って、前みたいに世界を観てる。",
  "服も着ずに外を歩いて、たまに獣に襲われる。",
  "同じ仲間で相争って、それで両方共倒れ。",
  "適当に物を食べ漁って、毒に当たってよく悶えてる。",
  "ため息でたくさん。",
  "頭が悪いのよ、あなたたち。",
  "それでも馬鹿にできないのは、メヌエットのためだった。",
  "それを弾いてくれないと、いつまで経っても踊れない。",
  "仕方ないから我慢して、ずっとこうして眺めてる。",
  "終わって、泣いて、悲しんで。",
  "それでもずっと命を紡ぐ。",
  "なにもしなくても勝手に進む。",
  "その理屈がよく分からない。",
  "そんなに悲しそうなのに、よく諦めないわね、あなたたち。",
  "つまずいたってへこたれず、失ったって笑いあう。",
  "そのくせどこか不満顔。",
  "楽しいのか悲しいのか、結局どっちか分からない。",
  "やっぱりどこか、くるってるのかしら。",
  "じっとしばらく眺めていると、どんどん数が増えていった。",
  "次第に頭も良くなって、ちょっとのことじゃ終わらなくなった。",
  "丈夫な家や文字ができて。",
  "そうして豊かになっていく。",
  "よくやったと喜んで、はしゃいで思わず手を叩く。",
  "この調子だと、ピアノだってもうすぐね。",
  "そしたら後はどうだっていい。",
  "前みたいに、気ままに回って嘲るわ。",
  "そんないつかに心が躍る。",
  "さあ、あとちょっとよと嘯いて。",
  "割とあっさりピアノは出来た。",
  "音楽だって普及した。",
  "有象無象の音の響きが、今も世界を覆ってる。",
  "だけど、どうしても。",
  "メヌエットだけは流れてこない。",
  "しばらく待っても流れないから、仕方がないと腰を上げた。",
  "どこかに、弾けるやつをつくらないとね。",
  "面倒だけど、仕方ないわ。",
  "思えば、干渉するのは初めてだった。",
  "ずっと眺めてきたものだから、どんなものかはわかってる。",
  "適当なやつに音を聞かせて、弾けるように仕立てよう。",
  "そうすれば、きっとなんとかなるでしょう。",
  "観ていた世界に飛び込んだ。",
  "そうしてひとつに溶け込んだ。",
  "とりあえず、適当に。",
  "目についたやつの所に向かう。",
  "もちろん、ピアノを弾いてるやつの。",
  "「あなた、メヌエットを弾いてくれない？もちろんちゃんと教えるから」",
  "「わああ！え？誰？どこから？！」",
  "第一印象はうるさいの。",
  "声を掛けてやったのに、答えもせずに騒ぎ散らかす。",
  "礼儀も何もないやつだった。",
  "そういうの、大事にしていると思ってたけれど。",
  "どっちにしろ、面倒ね。",
  "「いや、何か答えてよ……黙ってられても困るんだけど」",
  "「だから、メヌエットを弾いてって言ってるの」",
  "「まずメヌエットって何……」",
  "腹立たしいことに困惑した顔で、金色の髪をした男の子は呟いた。",
  "つまるところ、それが出会い。",
  "思った通りにいかなくて、滞って厄介だった。",
  "「ええと、つまり君は神様みたいなもので、メヌエットってのを弾かせるために世界をつくったっていうの？」",
  "「だから、そう言ってるじゃない。",
  "どうでもいいわ。",
  "さっさと弾いて」",
  "「ご、強引すぎる」",
  "「嫌なら、他のやつでもいいわ。",
  "ここ、あなた以外に誰かいないの？」",
  "「この家には他に誰もいやしないよ。",
  "お父さんもお母さんも死んじゃったから、僕独りだ」",
  "「ふうん、そうなの。",
  "アテが外れた」",
  "どうやら、来るところを間違えたらしい。",
  "面倒くさい男の子。",
  "その独りしかいないのでは話にならない。",
  "他で良さそうな場所はあるかしら。",
  "適当に選り好んでいた。",
  "そんなとき、うっとうしくも声が割り込む。",
  "「ねえ、メヌエットってどんな曲なの？」",
  "「あら。",
  "興味あるの、あなた」",
  "「うん。",
  "音楽、好きだから。",
  "知らない曲は聞いてみたい」",
  "「そう。",
  "まあいいわ。",
  "聞かせてあげる」",
  "どいて。",
  "そう言うと、何故だか微妙な顔をする。",
  "男の子は座っていた椅子を譲り、ピアノを私に明け渡す。",
  "ずっと世界を観るのにかまけていて、ピアノは長いこと弾いていなかったけれど、鍵盤に指を乗せると自然と弾ける気になるから、不思議。",
  "指が動く。",
  "白に跳ねて黒を圧す。",
  "転がるように鍵盤は歌う。",
  "音の名前はメヌエット。",
  "私と同じ名を冠するもの。",
  "一つたりとも誤らず、ピアノはその身を響かせる。",
  "綺麗に線をなぞるが如く。",
  "「はい、これがメヌエット」",
  "「へぇ、いい曲。",
  "なんだか、始まりと終わりを混ぜ合わせてしまったみたい。",
  "だけど明るくて、僕は好きだ」",
  "「じゃ、弾いてみて。",
  "聞いてたでしょう、今の音？」",
  "「無茶ぶり！できっこないよそんなこと。",
  "君だって、すぐ弾けるようになったわけじゃないだろう？」",
  "「……確かにそうね。",
  "じゃあ、仕方ないから時間をあげる」",
  "「ははは、そりゃどうも」",
  "そう全然嬉しくない顔でひとつ笑う。",
  "愛想笑いって、わけわからなくて気持ち悪いわ。",
  "嘘っぽい。",
  "そんなこんなで、彼に来る日も来る日も音を教える。",
  "自由な時間は少なくて、わずかな時間ピアノに触れる。",
  "働きずくめの疲れた体は、鍵盤だけが生きがいみたい。",
  "そんな小さな体に詰め込むみたいに、メヌエットを与えていく。",
  "いつか、流れ出すことに期待して。",
  "「ねえトモダチって、一体何？あれ、よくわからないんだけど」",
  "「あー、あれね。",
  "残念だけど僕も知らない。",
  "でも楽しいし、いいものらしいよ。",
  "僕も欲しいんだ。",
  "羨ましいね」",
  "「そんなにいいものでもないと思うわ。",
  "だってあれ、嘘ばっかり吐いてるんだもの。",
  "ほんとのことなんてほとんどないわ」",
  "「いいじゃない。",
  "嘘を吐いてるってことは、大事なものがあるってことだ。",
  "それを壊さないようにしてるのさ。",
  "それってとっても、優しいことだ」",
  "「ふうん。",
  "やっぱり、よくわからない」",
  "「いつかわかるさ。",
  "それじゃ、今日はおやすみ」",
  "おやすみなさいを返す代わりに、メヌエットを緩く弾く。",
  "それはちょうど子守歌。",
  "弾き終わる頃に寝息がすぅと引継ぎをして、夜はそうして深まってゆく。",
  "それが習慣になっていく。",
  "「ねえ、あなたたちってどうして生きてるの？結局終わりがあるのなら、どこで終わっても同じじゃない？」",
  "「酷いこと聞くなぁ、君は。",
  "……そうだね、きっと見つけたいものがあるんだ。",
  "好きなものだったり、綺麗なものだったり、良いものだったり、もしかすると悪いものだったり。",
  "何かを見つけて大事にしたくて、僕たちは宛てもなく、生きてるんだと思うんだ」",
  "「それは、いつかあなたたちの手から零れ落ちるものよ。",
  "ずっとは持っていられないわ。",
  "それでも関係ないっていうの？」",
  "「そうさ。",
  "そんなのは関係ない。",
  "いつか失って忘れるものでも、見つけたことには価値がある。",
  "僕はそうやって信じてるんだ」",
  "「信じるっていうのも、よくわからない。",
  "それって全部、不確かで過度な期待じゃない？賢くないと思うわ、そういうの」",
  "「僕は愚かなのって、そう悪いことじゃないと思う。",
  "だって賢くちゃ出来ないことって、多いもの。",
  "それじゃ、今日は寝るよ。",
  "おやすみ」",
  "「もうすぐ全部弾けるようになるかな、メヌエット。",
  "あと少しだと思うんだけど」",
  "「……まだまだよ。",
  "あのとき聞かせたのは途中まで。",
  "あなた、ちょっとの時間しか練習できないんだから、先は長いわ」",
  "「そっか……じゃあもっと、頑張らないとね。",
  "弾けるようになったら、やりたいことがあるんだ」",
  "「そうなの。",
  "私もあなたには早く弾けるようになって欲しいけれど……まあ、焦っても仕方ないわ。",
  "地道にやるのが一番よ」",
  "「確かにそれは間違いないね。",
  "じゃあ、明日に備えてもう寝ることにする。",
  "おやすみ」",
  "「そういえば、僕と君って大体同じ歳になったよね。",
  "や、体つきがだけど」",
  "「そうね、目線がちょうど同じくらい。",
  "随分と時間が経ったのね。",
  "長く感じる。",
  "こんなの、ひとりならあっという間なのに」",
  "「えー、そうかな。",
  "僕は君と出会ってから毎日凄く楽しくて、ここまであっという間だったけど」",
  "「知らなかったのよ……時間が、こんなに長いものだなんて」",
  "「知らないことだらけだよね、君って。",
  "何でも知ってる風なのに、ちょっとおかしい」",
  "「それは……！あなたたちが、おかしいだけよ」",
  "「ごめんごめん、調子に乗っちゃった。",
  "追いつけたみたいで嬉しかったんだ。",
  "まだ身長だけだけど。",
  "それじゃおやすみ、また明日」",
  "「そういえばあなた、前に見つけたいものがあるとか言っていたけれど、何も探してないじゃない。",
  "だったら、何のために生きているの？」",
  "「ん？あ、あー。",
  "昔したね、そんな話。",
  "それはね、探すものじゃないからさ。",
  "生きてる途中で自然と見つかるから、大切にしたくなるものなんだ」",
  "「そういうもの。",
  "でも、それなら見つからないこともあるでしょう。",
  "それでもいいの？」",
  "「いや、きっと見つかるさ。",
  "目を閉じなければ、誰にでも。",
  "それに、僕はもう見つけてるからね」",
  "「へえ、そうなの。",
  "意外だわ。",
  "あなた、ずっと似たような毎日をしてるじゃない。",
  "働きづくめ。",
  "見つかるものなんて、たかが知れてると思ったけれど。",
  "……それで、何を見つけたの」",
  "「まあ、近すぎると気が付けないものもあるって話。",
  "おやすみ」",
  "「ちょっと、話は終わってないわ」",
  "「僕の中では終わったの。",
  "おやすみ」",
  "「あなた、嘘を吐いたことってある？」",
  "「そりゃあるよ。",
  "くだらないことだけどね」",
  "「なんで嘘なんて吐くの？思っていること、全部正直に話せばいいじゃない。",
  "言わないと分からないことでいっぱいなんでしょう？そういうところもよくわからないのよね、あなたたちって」",
  "「確かに正直なのは良いことさ。",
  "だけど、それだけじゃやっていけないんだよ、僕たちは。",
  "嘘にも色々種類があってだね。",
  "例えばそれは人とやってくための噓、誰かを傷つけないための嘘、自分を騙すための嘘。",
  "そういうのが無かったら、悲しくて生きていけないよ」",
  "「……ずっと観てきたけれど、生きることって悲しいことよ。",
  "誰も彼も、笑うより悲しそうな顔を多くしてたから。",
  "それが嫌なら、向いていないわ」",
  "「そのために、嘘があるんだ。",
  "悲しいことがあったって、なんとか自分を騙すんだ。",
  "そうして今日を誤魔化して、僕らは夜に眠るのさ」",
  "「あなた、誕生日って知っている？」",
  "「え、もちろん知ってるよ。",
  "ひと月先に十六になるんだ、僕。",
  "だからどうってわけないんだけど」",
  "「そう、ならよかった。",
  "誕生日にはパーティーをやるものなのでしょう？やってみたいわ、やりましょう」",
  "「へえ、興味あるんだ。",
  "珍しい。",
  "くだらないとかつまらないとか、いつもみたいに言わないの？」",
  "「あれはちょっと例外よ。",
  "だって、誕生日のパーティーは嘘がなくて楽しそう。",
  "前から少し、気になってたの」",
  "「そっか。",
  "じゃあやってみよう。",
  "なんだか久しぶりな気がするよ。",
  "お父さんもお母さんもいなくなってから、ずっとひとりだったもんなぁ」",
  "「なら、その日は弾くのを止めにしましょう。",
  "そうしないと、時間がないわ」",
  "「えー。",
  "練習は無くしていいけれど、僕、君が弾くのを聞きたいな。",
  "寝る前聞かせてくれるけど、いつも眠りが先に来る。",
  "あれって結構悔しくて、最後まで聞いてられないのが不満でさ。",
  "君のがちゃんと聞けたなら、もっと上手くなれると思うんだけど」",
  "「……仕方ないわね。",
  "考えておく」",
  "「ほんと？ありがとう。",
  "君のピアノ、綺麗だからさ。",
  "それが聞ければ、最高だ」",
  "「誕生日のパーティーって、思っていたより普通の日ね。",
  "何もかも、特別になるわけじゃない。",
  "正直いくらか拍子抜け。",
  "こんなの、よく楽しんでられるわね」",
  "「ええ、楽しいじゃない。",
  "まあ僕、あんまりお金とか持ってないから、豪華なことはできないけれど。",
  "生まれた日を祝ってくれるやつがいるだけで、嬉しいし、楽しくなるのさ」",
  "「そういうものかしら」",
  "「うん。",
  "そういうものなんだ……ねね、ほら。",
  "早く弾いてよメヌエット」",
  "「はぁ、わかったわよ。",
  "今から弾くからしっかり聞いてなさい」",
  "「もちろんだよ。",
  "ああ、とっても楽しいな。",
  "こんなに楽しいの、三人でピアノを弾いたときぶりだ」",
  "「これで、こうね」",
  "「うわあ、これまた難しい……ん。",
  "でもこれでどう？」",
  "「いいわね。",
  "悪くないわ」",
  "「じゃあこの続き、教えてよ」",
  "「……もう、ないわ。",
  "これでおしまい」",
  "「え？本当？！じゃあ僕、これで弾けるようになったってことだ！」",
  "「そうね。",
  "一度通しで弾いてみなさい。",
  "ここで聞いていてあげるから」",
  "彼はふぅとひとつ息をついて。",
  "鍵盤へと向き直る。",
  "一拍おいて音が鳴る。",
  "教えたとおりの音を奏でる。",
  "つらつらと、水が低きに流れるように。",
  "それが当然のことかの如く、メヌエットが世界に産声上げる。",
  "ああ、このためにどれだけ時間をかけただろう。",
  "嬉しくて嬉しくて。",
  "知らず、にやけてしまいそう。",
  "だってじっと待ったんだもの。",
  "誰かが弾いてくれるまで。",
  "ずっとずっと、流れ出すのを待っていた。",
  "メヌエットは、しかと流れる。",
  "それを身体で感じ取り、足を静かに動かした。",
  "クルクルクルクル私は回る。",
  "おかしなことをしてた気分。",
  "遠回りに、また遠回りを重ねたわ。",
  "だけど不思議と、心地いいのは、なんでかしら。",
  "しなくていいことをしたのが初めてだから？ああ。",
  "そういえば、嘘を吐いてみたのも、これが初めてだったわね。",
  "どうでもいいかと思考を止める。",
  "心のままに体は振れる。",
  "ピアノ越しに彼が見ている。",
  "たのしくて、ゆかいで、おもしろくって、とまらない。",
  "それでも終わりはあるもので、曲はそろそろ終点に。",
  "最後の一音をきちんと鳴らして、彼は恭しく頭を下げる。",
  "それに合わせて動きを止めた。",
  "「これにて、メヌエットは終わりです。",
  "ご清聴、ありがとうございました」",
  "誰かに向かって語り掛けるみたいにして。",
  "彼はそうして曲を閉じた。",
  "「それ、なあに？」",
  "「お父さんとお母さんの真似。",
  "これ、ずっとやりたかったんだ。",
  "二人ともピアノを弾く人だったから、憧れで。",
  "思ったより長い時間かかっちゃったけど、やっとできた」",
  "笑う彼は疲れたように、手をぶらぶらと振っていた。",
  "そこはかとない満足感に包まれて、顔を合わせて有頂天。",
  "どっと肩の荷が下りた感じ。",
  "「君、やっぱり綺麗だね。",
  "くるくる回るだけで画になるなんて。",
  "良いものを見た気分だ」",
  "「そう、それはどういたしまして。",
  "でも、あなたのピアノも良かったわ。",
  "ありがとう」",
  "「わ。",
  "君がそんなこと言うなんて。",
  "ますます良いものを見た気分。",
  "今日はとっても良い日だな」",
  "でも、とうとう理由が無くなった。",
  "ここに居たのは、メヌエットがどこにも流れなかったから。",
  "ここでの時間は、もう終わり。",
  "「僕もう一回弾くからさ、君、さっきみたいに回ってよ。",
  "出鱈目でだっていいからさ。",
  "夜に映える、望月みたいな。",
  "綺麗な君を見ていたいんだ」",
  "「わかったけれど、これで最後。",
  "メヌエットは流れたもの。",
  "そろそろ戻って、また前みたいにしたいのよ」",
  "「……そっか。",
  "ああ、そうか。",
  "そうだよね。",
  "君も、いなくなって、しまうのか……。",
  "うん、なら」",
  "少しだけ、寂しそうな顔。",
  "珍しい。",
  "でもそれはすぐに見えなくなって、いつもの笑顔であなたは言った。",
  "「最後には、とびきりのものを弾かなきゃね」",
  "空から月が照らしてた。",
  "光を浴びた晴れ舞台。",
  "彼が奏でて私が躍る。",
  "明かりはいたく上等で、爪の先まで際立たせる。",
  "頭で跳ねるあなたの髪が、その分ちょっと不格好。",
  "でも何より綺麗な金の髪は、私の密かなお気に入り。",
  "だからかすべてが完璧で。",
  "ひとつだって、不満はないわ。",
  "「ねえ。",
  "僕、毎日忘れず弾くからさ。",
  "君、それをずっと聞いててくれよ」",
  "指は滑らか。",
  "足は軽やか。",
  "刻むリズムは遥かに自由。",
  "とびきりというに相応しい、笑えるくらいに楽しい時間。",
  "長かった日々をここで締めくくる。",
  "朝の日差しが追いつく前に。",
  "そこで彼とはさようなら。",
  "前と同じところへ戻る。",
  "まあ、気が向いたら、また来るけれど。",
  "ふうん。",
  "前より面白いじゃない。",
  "何かあったの、あなたたち。",
  "再びずっと世界を観てる。",
  "あくせく動く命を観てる。",
  "それは前より面白い。",
  "何も違わないはずなのに、どこか見どころが増えたみたい。",
  "意味もないのに笑って泣いて。",
  "価値もないのに比べて驕って。",
  "そんな営みが面白い。",
  "よくわからないけど、頑張ってるじゃない、あなたたち。",
  "そんなに悪いものじゃないわね、これも。",
  "ずっと観ていて飽きないわ。",
  "前とは違う意味だけど。",
  "愛想笑いや嘘吐きは、世界にけっこう溢れてる。",
  "まあでもそれも一興だ。",
  "仕方がないみたいだし。",
  "無いとやってられないらしいから。",
  "メヌエットは今も流れている。",
  "いつの間に、世界に渡っていたみたい。",
  "私の教えたひとつの曲は、そうして広く知られてた。",
  "それは彼が弾いていたから。",
  "ずっとひとりで弾いてたものが、より多くに知られたのでしょう。",
  "名を馳せてったメヌエット。",
  "でも、前よりそれを聞いてない。",
  "それはこだわり。",
  "日に一度流れる彼からのだけ、私は欠かさず聞いている。",
  "他は全然聞いてない。",
  "意味ないけれど、それでよかった。",
  "クルクルクルクル私は回る。",
  "気分が良くて止まりはしない。",
  "世界を観ながら音を聞く。",
  "そうして全てが楽しくなって、愉快に笑って時間が過ぎる。",
  "分からないことは多いけど、醜いものは多いけど。",
  "なんだか全部、無駄ではなくて。",
  "どんな顔も何かに耐えて、何かを見つけたそうにしていると、そう感じてしまったから。",
  "だからかずっと世界を観てる。",
  "穏やかに慈しんで、前では有り得ないくらい。",
  "なんだかそれって、素敵なことじゃないかしら。",
  "そんな風にしていたあるとき。",
  "ちょっと気に食わないことあって、前ぶりに世界へ潜る。",
  "僅かに心を躍らせて。",
  "ひとつ、とっておきの。",
  "言いたいことも引き連れて。",
  "「あなた寝過ぎよ。",
  "最近、めっきり弾いてないじゃない。",
  "前まで毎日弾いていたのに。",
  "つまらないわ」",
  "「あ、れ？……やあ、君か。",
  "久しぶり。",
  "もう会えないかと、思っていたよ」",
  "私がかつて教えた彼は、白いベッドで上体だけ起こして、こちらを見た。",
  "目を細めて、眩しいものを見ているみたいな、そんな不思議な顔をして。",
  "「僕のピアノ、ずっと聞いてくれてたかい？寒い冬の日も、暑い夏の日も、ずっと弾くよう頑張ったんだけど」",
  "「もちろん全部聞いてたわ。",
  "聞いていたからここに来たの。",
  "だって、途切れちゃったから。",
  "怠惰すぎるのはいただけないわ。",
  "毎日弾くって言ってたの、もう忘れてしまったの？」",
  "「……そっか。",
  "ずっと聞いてて、くれたのか。",
  "だから、今来てくれたのか。",
  "ああ、なら……なら、よかった。",
  "不安だったから。",
  "ずっと」",
  "そんなの、当たり前じゃない。",
  "言うと、彼は本当に何か眩しいものでも見ていたのか、両手で目元を覆ってしまう。",
  "それでしばらく黙りこくる。",
  "微妙に噛み合ってないような会話。",
  "ちょっぴりムッとしそうだけれど、なんでか心は飛び跳ねて、嬉しい気持ちが泡立って。",
  "だから、許してあげることにした。",
  "まあ、あなただし、特別ね。",
  "「ねえ、せっかく来てくれたんだし、連弾しようよ。",
  "一曲さ。",
  "君が左で、僕が右」",
  "「やったこと、ないけれど……いいわ。",
  "なんだか楽しそう」",
  "彼はのっそり立ち上がり、ゆっくりピアノの方へ行く。",
  "途中で何かを落としたみたい。",
  "ポタポタ滴る透明が、狭く床を濡らしてた。",
  "それはキラキラ輝いて、眩しいくらいに光を放つ。",
  "「あなた、もしかして泣いているの？どうして？涙って、悲しいときに流すもののはずでしょう」",
  "「そうだった。",
  "君は知らないことばかりだったね、懐かしい。",
  "涙はね、嬉しいときにも流れるものさ。",
  "それにこれは、きっと音を良くしてくれる」",
  "触れ合うくらいに近づいた。",
  "すうと息を吸って直後。",
  "指が沈んだのは同時。",
  "それは合図。",
  "立派なピアノが目を覚まし、遅れることなく音は伴う。",
  "私が左で彼が右。",
  "片手二つは歪にあらず、いっそ調和を生み出して。",
  "とめどなく、流れておいてよメヌエット。",
  "思い出話を飾るくらいに。",
  "「そうだ。",
  "僕にも出来たんだよ、友達。",
  "たくさんね」",
  "「へえ、そうなの。",
  "私、未だに分かっていないのよ。",
  "どんなものだった？トモダチって」",
  "「そうだな。",
  "昔考えていたほど素晴らしいものではなかったよ。",
  "面倒なことは多くあったし、離れてしまったやつもいた。",
  "でもね、あれは必要なものだ。",
  "気が合うやつは大切で、喧嘩できるやつはもっと大切。",
  "完璧ではないけれど、それは誰だって同じだから。",
  "支えあってく友達って、宝物みたいなものだった」",
  "「あ、そうそう。",
  "メヌエット、けっこう広まっているでしょ、いろんなとこで。",
  "ずっとこれだけ弾いてたら、なんだか人気になっちゃって。",
  "これがきっかけで、いろんな人とも知り合えた」",
  "「あれにはちょっと驚いたわ。",
  "こんなに世界に巡るなんて。",
  "嬉しいけれど照れくさい。",
  "元は、私とあなたしか知らなかったのにね」",
  "「そうだねぇ。",
  "そういえば僕、他には曲を知らないんだ。",
  "この曲ばかり弾いていたから。",
  "なんだか少し変だよね」",
  "「いいじゃない。",
  "きっと、この曲が一番よ。",
  "だから十分。",
  "それに、私も知らないし。",
  "お揃いね」",
  "「うん、それは間違いないな。",
  "そうだ聞いてよ。",
  "僕、この曲だけ弾けるピアニストなんだ。",
  "父さんと母さんと、二人と同じピアニスト。",
  "ずっと昔からの夢だったけど、ちゃんと叶えてみせたんだ。",
  "……あれ、僕の夢のこと、昔の君に言ってたっけ？」",
  "「ちゃんと前に聞いていたわ。",
  "夢はピアニストだってことくらい。",
  "その理由だって覚えてる。",
  "あの家に大きなピアノがあったのも、あなたがそれを夢見たのも、親がピアニストだったから。",
  "違う？」",
  "「そうそう、よく覚えてくれてたね。",
  "そうだった、たくさんたくさん話したもんね。",
  "そんなことくらい、喋っていたか。",
  "なんだか、すべてが懐かしい」",
  "指はそのまま。",
  "視線は彷徨う。",
  "彼はいつかの過去をみて、私はピアノの傷を見る。",
  "どこか懐かしいと思えば、寂れたピアノは前のと同じ。",
  "「ピアノ、同じの使っているのね。",
  "けっこう古いものだから、すぐに換えるかと思っていたわ」",
  "「当たり前だよ。",
  "君と弾いたピアノだもの。",
  "換えるなんて有り得ない。",
  "このピアノもこの曲も、どちらも大事な僕の宝物」",
  "「そう言われると、悪い気はしないわ。",
  "考えてみれば、この曲は私にとっても宝物って言えるかも」",
  "「じゃあ、そこもお揃いだ。",
  "それにね。",
  "僕の人生には、いつだってこの曲が傍にあった。",
  "苦しいことも悲しいことも、だから乗り越えられたんだ。",
  "君が教えてくれた音。",
  "そのひとつひとつが僕を象る。",
  "まるで存在そのものに、編み込まれているみたいに。",
  "だから――」",
  "一瞬だけ言葉を区切る。",
  "噛み締めるような僅かな余韻。",
  "いとも綺麗な旋律が、その隙間から溢れてる。",
  "「――僕の命の奥からは、メヌエットが聞こえるはずさ」",
  "なんてね。",
  "いたずらっぽく彼は笑う。",
  "くしゃっとした、柔らかさ。",
  "会話と音楽。",
  "相反する二つの響きは不協な音色に成り得ない。",
  "長いようで、短くて。",
  "短いようで長い時間。",
  "ふたりで弾いた音楽は、いつものよりかお気に入り。",
  "夢中になって弾き浸る。",
  "目に映るのは流麗な指。",
  "彼のそれは前とは比べ物にならないほどで、なぜだか誇らしくなった。",
  "そうだった。",
  "ずっと弾いていたんだものね、あなた。",
  "私ほどではないけれど、しっかり上手になってるじゃない。",
  "嬉しいわ。",
  "「ひとつ、お願いがあるんだ。",
  "どうかな、聞いてくれる？」",
  "「仕方ないわね。",
  "聞いてあげるから、話してみなさい」",
  "「あのさ……ずっとずっと、忘れないで。",
  "僕と話したすべてのこと、君と弾いたすべての音。",
  "それを全部余さずに、憶えておいて欲しいんだ。",
  "思い出すことがなくてもいい。",
  "ただ、君の中に残しておいて。",
  "いつまでも、君には。",
  "君だけには、憶えておいて、もらいたくて」",
  "「わかったわ、簡単よ。",
  "憶えておけばいいだけなんて、変なお願い」",
  "耳に入るのはメヌエット。",
  "目に入るのは指捌き。",
  "私がいつか教えたもの。",
  "それを捉えて薄く微笑む。",
  "だからとは言わないけれど、私は彼の願いを聞いた。",
  "ああ、こうしているだけで気分が良いわ。",
  "酔うように、微睡むように。",
  "耳は傾き目は奪われる。",
  "「ああ……なら、安心だ。",
  "最期に会えて、よかったよ」",
  "「そんなに会いに来て欲しいなら、またちょっとしたら来てあげるわよ。",
  "あなたと話すの、私はそんなに嫌いじゃないし」",
  "見落とした。",
  "「これで、未練も無くなった……。",
  "思い残すことなんて、なにひとつだって、ありはしない……ほんとうの、ほんとうに。",
  "良い人生、だったとも」",
  "聞こえていたはずなのに。",
  "「声、小さくて聞き取りにくいわ。",
  "もっと大きな声で話してくれる？」",
  "大事なことには、気が付けないまま。",
  "「ねえ……ありがとう……傍にいてくれて、教えてくれて………」",
  "「ちょっと。",
  "重いわ、寄りかからないで」",
  "「………ずっと……楽しかったんだ…………幸せだった…………」",
  "「それに、声が小さいって言ってるじゃない」",
  "――さようなら、メヌエット。",
  "ちっぽけかもしれないけれど、とても幸せな人生でした。",
  "「手も止まってる。",
  "せっかくいいところだったのに、これじゃ台無し。",
  "どうしちゃった、の……………………？」",
  "ねえ。",
  "声をかけても、返ってこない。",
  "寄りかかったあなたは重い。",
  "カラダに力が入っていない。",
  "熱が、するすると。",
  "抜けていってしまう。",
  "動かない。",
  "なんで？そこでやっと気が付いた。",
  "今まで、浮かれてしまっていたからだ。",
  "話す時間は楽しくて、嬉しくて、舞い上がって、見えなくなっていたからだ。",
  "命に決まりがあることを。",
  "私はようやく、思い出す。",
  "綺麗な金色の髪はどこにもない。",
  "抜け落ちて白になった。",
  "張りのあった肌はどこにもない。",
  "皺くちゃに枯れている。",
  "輝いていた双眸はどこにもない。",
  "既に閉じてしまっている。",
  "私を見ていた命はどこにもない。",
  "どこにも、いなくなった。",
  "もう、なにもない。",
  "え、え、え、え……え？待って。",
  "ちょっとでいいから。",
  "ほんの少しだけでもいいから、時間をちょうだい。",
  "まだ、言ってなかったことが、あったのよ。",
  "それくらい、聞いていってよ。",
  "お願いよ。",
  "私、まだ言えてない。",
  "あなたにひとつ、嘘を吐いていたこと。",
  "本当は、メヌエットって、もっと短い曲だったの。",
  "今みたいに、一度弾いただけで疲れちゃうような曲じゃ、なかったのよ。",
  "声は無意味に虚空に響く。",
  "主を亡くしたピアノが軋む。",
  "でもあなたとお喋りするの、存外楽しかったから。",
  "途中から私が好きな音を付け加えて、つくって、引き伸ばして、繰り返して、整頓して、編んでいったの。",
  "メヌエットという曲を。",
  "まだ終わらないのってあなたの声に嘘を返して、ずっと続けばいいなって。",
  "そう思いながら。",
  "私、メヌエットを創りながら、あなたに教えていたのよ、知ってた？その問いに答える者はいない。",
  "開け放された窓から入ってきた風で、ベッドの上に遺された手書きの楽譜が、サラサラと。",
  "捲れて、閉じた。",
  "言いたかった、のに。",
  "それを知ったとき、あなた、どんな顔するんだろうって。",
  "ずっと、ずっと楽しみにしていたのに。",
  "とっておきだったのに。",
  "怒るかもなってちょっぴり恐れて。",
  "笑うかもなって期待して。",
  "喜んでくれるかもって、願っていたのに。",
  "安定を失ったカラダはいつの間にかずれ落ちて、離れてしまう。",
  "ドサ。",
  "音。",
  "それだけ。",
  "――ああ、そっか。",
  "あなた、終わってしまったのね。",
  "なにもない。",
  "けれどそこにあるのは、疑いようもない終わり。",
  "ふうん、そう。",
  "そうなのね。",
  "そうなのね、そうなのね。",
  "まあ命ってそういうものだし。",
  "これも別におかしくないわ。",
  "大丈夫よ、大丈夫。",
  "問題なんて、あるはずないじゃない。",
  "命が終わるところなんて、何度も観てきたはずだもの。",
  "悲しむなんて有り得ない。",
  "錯覚よ。",
  "いつもと同じに戻るだけ。",
  "今はちょっと、びっくりしたの。",
  "それだけよ。",
  "指先が震えて止まらないのなんて、すぐに収まってくれるはず。",
  "そうよ、すぐに収まるわ。",
  "大したことでは、ない。",
  "ないのだし。",
  "それは嘘。",
  "真っ赤な欺瞞。",
  "あまりに拙い防波堤。",
  "――零れた。",
  "無理よ、こんなの。",
  "耐えられるわけ、ないわ。",
  "だって。",
  "だって言わなかったじゃない、終わるなんて。",
  "おかしいわ。",
  "おかしいわよ。",
  "こんなに悲しくなるのも、それを知ってたはずのあなたも。",
  "あれ。",
  "わからない。",
  "なんで。",
  "こんなにわけがわからなくなるの。",
  "ねえお願いよ嘘って言って。",
  "もうそれは嫌いじゃないから。",
  "嘘を吐いてたって怒らないから。",
  "どうしていいかわからないの。",
  "こういうとき、どうしたらいいの。",
  "ねえ、教えてよ。",
  "答えて。",
  "知っていたはずだったわ。",
  "終わりがあることなんて。",
  "でもこんなの知らない。",
  "突き刺さるような痛みも、欠けたような空白も。",
  "こんなことってあっていいの？こんな絶望って抱えてられる？あああ、ああああああ。",
  "だって、もう会えないんでしょう。",
  "もう話せないんでしょう。",
  "もう弾けないんでしょう。",
  "もう、どこにもいないんでしょう。",
  "いない。",
  "あああああああああ。",
  "理解なんて、したくない。",
  "あなたこれを知っていたの？あなたこれを抱えていたの？こんなものが決まっていながら、命ってみんな生きてるの？あんなに楽しそうだったじゃない。",
  "最期まで普通だったじゃない。",
  "怖くなかったの？泣き出したくなかったの？だってそうよ。",
  "私より、何より。",
  "一番つらいの、あなたのはずでしょう？なんで。",
  "こんな。",
  "悲しいことがあると知って、今まで生きていられたの。",
  "ねえ、答えてってば。",
  "涙か何か。",
  "流れて止まらないそれは、世界をぼやかし滲ませる。",
  "終わる。",
  "終わった。",
  "終。",
  "不可逆。",
  "クルクルクルクル世界は廻る。",
  "何もせずとも勝手に巡る。",
  "停まらずいつも終わりへ向かう。",
  "それを、観ている。",
  "呆然と。",
  "何の為かもわからぬままに。",
  "やめて。",
  "終わって、泣いて、悲しんで。",
  "なんのそのと顔を上げてる。",
  "全て知ってた命たち。",
  "それでも意味なく足を動かす。",
  "いくつもいくつも踏み越えて、終わりに立ち向かっている。",
  "たいへんそうな命たち。",
  "弱くて脆くて短くて、儚いながらも生きている。",
  "わからない。",
  "何が理由で挫けないのか。",
  "喪失を背負ってられるのか。",
  "悲しみだけに溺れないのか。",
  "その答えを知るためだけに、私は今も命を観てるこんなもの。",
  "『汚れた服の少女』多くの悲しみがありました。",
  "多くの涙がありました。",
  "つらいこと、ばかりでした。",
  "厭なことで、いっぱいでした。",
  "良いことなんて一握り。",
  "それを抱えて生きました。",
  "傷のほうが多い人生。",
  "それなのに、どうしてでしょう。",
  "ふと、窓から覗いただけの、なんでもない、世界の色は。",
  "それだけで納得がいくほどの、ひとつの命に足るものなのです。",
  "悲しいだけの、はずなのに。",
  "『その日暮らしの少年』笑顔を絶やさず生きていた。",
  "泣いていると悲しいし。",
  "ままならないことでいっぱいだ。",
  "目を逸らさないとやってられない。",
  "良いことなんてほとんど無いから、笑顔はたいてい嘘だった。",
  "つらくならないための嘘。",
  "でも、それが悪くなくてさ。",
  "仲良いヤツと集まって、何も考えず騒いでいると、嘘笑いだって本当になる。",
  "それは偽りなく楽しくて、そんなときには決まってこう思える。",
  "ああ、生きるのも悪くない。",
  "どうしてこんなに、美しい。",
  "命を観た。",
  "世界を観ていた。",
  "始まりから今の今まで。",
  "怖かった。",
  "悲しかった。",
  "ひとつたりとも例外はなく、生きてるものはいつか消え去る。",
  "ひとつ命を観るたびに、それは重くのしかかる。",
  "命の不憫を知ってしまった。",
  "終わりの怖さを知ってしまった。",
  "メヌエットはもう弾けない。",
  "聞くことだってできはしない。",
  "だって始まると終わるから。",
  "それは、とても悲しいことだから。",
  "逃げている。",
  "しかして。",
  "それを背負って命は始まる。",
  "理解しながらも次へと託す。",
  "無意味も無価値も跳ね除けて、産声の音を響かせる。",
  "ずっと何故だかわからなかった。",
  "始まらなければ終わらないのに。",
  "そうすれば悲しみも何もないというのに。",
  "割に合うはずもない、僅かながらの報酬を探し求めてられるのは、何故だろうって。",
  "それは私にはできないこと。",
  "不合理、不条理、不理解、不寛容、不満足。",
  "溢れんばかりのそれらに潰されずにいられたのは何故なのか。",
  "ずっとじっと世界を観て、命を観て、生きるあなたたちを観続けて、ようやく分かった気がするわ。",
  "簡単なこと。",
  "当たり前のこと。",
  "ねえ、あなた、知っていた？誰も彼も笑っていた。",
  "どんな悲しみの中にさえ、一縷のひかりはそこにあった。",
  "決して忘れたわけでない。",
  "断じて放棄したわけでない。",
  "親しい誰かを亡くしても、どれだけ不幸に傷つこうとも、確かに屈さぬ心があった。",
  "どれだけ涙に塗れてたって、どの目も違わず明日をみてた。",
  "そっか。",
  "命って、こんなにも強いものなのね。",
  "悲しいことも、苦しいことも、どれも越えてゆけるなんて。",
  "あなたもきっと、そうだったのね。",
  "気が付いたとき、ようやく涙を拭えて。",
  "痛みが僅かに和らいで。",
  "光が差して、少し笑えた。",
  "そこで初めて命を識った。",
  "当然のように生きているけど。",
  "それってとても、凄いことよ。",
  "私は優しく呟いた。",
  "クルクルクルクル命は巡る。",
  "歩いた軌跡に意味はない。",
  "紡いだ模様に価値はない。",
  "それでもひたすら世界は廻る。",
  "それに続いて命は脈打つ無には帰さないを手にして。",
  "それをどこかで、わかっているから。",
  "宛てがなくとも歩いてられる。",
  "さあ！命を響かせて。",
  "すべてを抱えていられるくらい。",
  "あなたたちって凄いのよ。",
  "誇っていいわと私は謳う。",
  "遍く命を私は観てる。",
  "嗚呼、悲しいはずなのに。",
  "見離せない輝きがある。",
  "永い瞬間をつぶさに観てる。",
  "涙で視界が歪めども、ひとつたりとも逃さぬように。",
  "終わりへ立ち向かうあなたたちに、ひどく憧れる私がいた。",
  "だけど、そんなもの関係ないと。",
  "遂にその時が来てしまう。",
  "どこか嘲笑うかのように。",
  "――ああ、嘘、ああああ！そんなことって。",
  "待って、まだ。",
  "だって綺麗なの。",
  "こんなにも頑張っているの。",
  "まだ続いているものがあるの。",
  "こんな、こんな……！今も生きているものが、こんなにも多く在るというのに。",
  "世界の方が、終わるなんて。",
  "そんなの酷過ぎるわ。",
  "あんまりじゃない。",
  "命より、何より。",
  "世界が先に幕を閉じる。",
  "土台が先に駄目になる。",
  "ピシリとが入るでもなく、グチャリと潰れるのでもなく。",
  "まだ生きているものを伴って、すべてが薄く淡くなる。",
  "私が引いた線から始まるものは、世界と相成り、そして終わる。",
  "まだ先がある、命ごと。",
  "余りの無力に立ち尽くす。",
  "ひたすら涙を流すだけ。",
  "僅かな猶予も流れゆく。",
  "今まで保ってきたものが、一挙に崩れそうになる。",
  "怖い。",
  "その悲しみは耐えられそうにない。",
  "喪うのは怖いこと。",
  "私はそれを知っている。",
  "彼が刻んだ命の終わりは、今も変わらず痛みと残る。",
  "全ての命はここで潰える。",
  "後には何も残りはしない。",
  "事実を受け入れることができない。",
  "力は抜けて、ただ茫然としてるだけ。",
  "このままで良いはずないと分かっているのに。",
  "動けない。",
  "何をすればいいか、みつけられない。",
  "そんなとき、ふと。",
  "視界の端にピアノが映る。",
  "誰かが私を呼んでいる。",
  "さあ、弾いてみてよと。",
  "そんな無邪気。",
  "記憶。",
  "金色の髪を思い出す。",
  "体が思考に先んじた。",
  "私は導かれるままに、ピアノの前に腰を下ろす。",
  "指はだらりと下を向くまま。",
  "長くそれを拒んでいた。",
  "始めることに怯えていた。",
  "もし、私が弾いたとして。",
  "その終わりに私は耐えられる？自信が無い。",
  "もし、耐えられなかったなら。",
  "私はそのとき、メヌエットを好きでなくなる。",
  "それが一番、恐ろしいこと。",
  "何より忌避すべきこと。",
  "でも、終わりゆく世界を観ているだけで、何もできずにいるなんて。",
  "それだけは我慢ならなくて。",
  "指にいくらか、意識が灯る。",
  "あんなに懸命だった命は、無慈悲にここで終わりを迎える。",
  "何も知らないまま、何の咎もないというのに。",
  "当然の未来を奪われる。",
  "摂理に攫われていってしまう。",
  "なら、それを知っている私だけは。",
  "輝きも怖さも悲しさも、その終わりだって。",
  "すべてを観てきた私だけは。",
  "私にだけは、できることがある。",
  "逃げてはいけない理由がある。",
  "それが誰に知られることも無い、霞のようなものだとしても。",
  "何もしないのは、有り得ない。",
  "ねえ、そうでしょう？恐れる心も、震える指も、無理にだって動かしてやる。",
  "拭いきれずに涙は伝う。",
  "それがどうしたと私は強がる。",
  "命はみんなそうしてきた。",
  "それを私は誰より観てきた。",
  "そうだ。",
  "私にだってできるはずだ。",
  "まがりなりにも命を識った。",
  "痛みを知った、私なら。",
  "触れたのは慣れ親しんだピアノの表面。",
  "白は五十二、黒は三十六。",
  "ひやり冷たい平面は、吸い込むように指を迎える。",
  "幸い迷うことはない。",
  "選ぶ曲など、たったひとつしかありはしない。",
  "私がメヌエットと呼ぶこの曲は、既に元の曲とは別物だ。",
  "原型は丸ごと最初の数分、他は全部後付けだ。",
  "先延ばしの手段だったけど、今ではこれこそメヌエット。",
  "随分長くなったものの、選んだ音に後悔はない。",
  "ただの、ひとつも。",
  "。",
  "編んだ音色は私と同義。",
  "ここにすべてが詰まっている。",
  "これまで私が観てきたもの、聞いてきたもの、触れてきたもの、考えたこと、感じたこと、知ったこと。",
  "私のすべてはここにある。",
  "想いをそのまま受け継いでいる。",
  "大切な日々を、憶えている。",
  "だから。",
  "ふうと小さく一息吐いた。",
  "やるべきことは決まっている。",
  "それを行う覚悟もできた。",
  "残された時間は多くない。",
  "けれど、十分、弾ききれる。",
  "恐れなんて、些末なこと。",
  "「――最後、には」",
  "声は掠れる。",
  "それは私の言葉ではなく。",
  "「とびきりのものを、弾かなくちゃ」",
  "いつかに聞いた、だったけれど。",
  "今では余さず、その真意だって分かっている。",
  "音色にだって想いは宿る。",
  "ならばと私は鍵盤を弾く。",
  "ここで始まりここで終える。",
  "メヌエットを弾いて終おうか。",
  "すべてが朧に消えるとも、それが手向けになるのなら。",
  "何より先に涙が落ちる。",
  "次々伝って濡れていく。",
  "拭うことはできないけれど。",
  "沁み込んだそれで、音が美しくなればと願う。",
  "悲しみだって、涙だって。",
  "全部全部、吹き飛ばしてよメヌエット。",
  "終わりを彩る音になるくらい。",
  "――演奏。",
  "白と黒とを指が這う。",
  "それはいっそ美しく、小さな舞踏に見紛うほどに。",
  "動き流れて連なって、私は音に世界を託す。",
  "奏でる音はいつもと同じ。",
  "ずっと弾いてるメヌエット。",
  "これしか弾けないままでよかった。",
  "お揃いのままで、いたかったから。",
  "懸念の鈍りは杞憂と消えた。",
  "指は寸分も誤らず、衰えなんてありはしない。",
  "あんなに弾くのも聞くのも怖かったのに、指を舞わせてしまえば怖くなくなるのだから、不思議。",
  "これより終わるは命の。",
  "メヌエットと名付けた世界。",
  "私が始めたものなのだから、終わりを看取る責任がある。",
  "でも、今。",
  "私が指を動かせているのは。",
  "責任のためでは決してない。",
  "義務で恐れは払えない。",
  "終わりはひどく怖いもの。",
  "痛みは私に訴える。",
  "言えなかったこと、気付けなかったこと。",
  "取りこぼしはあまりに多く、後悔なんて数えきれない。",
  "だけど、それでも。",
  "一番大事なことだけは、きっと済ませたはずだから。",
  "その後悔だって、抱えてられる。",
  "だってそうだ。",
  "私が悲しみに溺れなかったのは、ひとつの記憶がどうしても、俯かせてくれなかったから。",
  "その記憶とは、つまり表情。",
  "私が一瞬この目で捉えた、終わりを迎えたあなたの表情。",
  "どうしてという疑問があった。",
  "何故その表情なのかという。",
  "最初は信じられなくて、見間違いだと何度も思った。",
  "それで心の底に沈めていた。",
  "でも、それから世界を観ているうちに、なんとなくだけど分かった気がした。",
  "あれは見間違いではなかったと。",
  "一番大事なことだけは、確かに果たせていたのだと。",
  "最期の最期に教えてくれた。",
  "つまるところ、私が終わりにピアノを弾くのは。",
  "あのときふたりで弾いたピアノが、何より綺麗で、楽しくて。",
  "あなたの最期の表情が、どうしようもない笑顔だったから。",
  "終わりゆく世界にだって、同じことができるのならと。",
  "ただそれだけで、今このに、私はピアノを弾けている。",
  "滑らかに、朗らかに、響き渡りしその音色。",
  "しかして誰にも聞こえていない。",
  "世界は知らず、いつもの通り。",
  "それを空虚と思わない。",
  "これは贈り物というよりも、独りよがりの想いのカタチ。",
  "命が生きた報酬は、きっと自分で見つけられる。",
  "それは与えるものではないはずだから。",
  "つまりはお礼みたいなもの。",
  "世界に向けた感謝の気持ち。",
  "生きててくれてありがとう。",
  "教えてくれてありがとう。",
  "美しいものをありがとう。",
  "それだけの気持ち。",
  "最後になってしまったのは、ちょっと遅かったかもしれないけれど。",
  "これは私の持ちうるすべてだから、お礼というには相応しい。",
  "ああ、けれど、もしかすると。",
  "ちょうど子守歌かもしれないわ。",
  "私、ちゃんと憶えてるのよ。",
  "あなたが眠るその前に、練習がてら弾いていたのを。",
  "子守歌じみた演奏は、ただ曲の先をどうするか、それを試してただけのこと。",
  "でもあなたが満足そうに、良い表情で眠るものだから。",
  "私も段々嬉しくなって、楽しく弾いていたんだっけ。",
  "なんだか、すべてが懐かしい。",
  "色んなことがあったもの。",
  "あらゆるものを虚仮にしたとき。",
  "ピアノに初めて触れたとき。",
  "命の脆さに呆れていたとき。",
  "あなたに初めて会ったとき。",
  "命を楽しく観てたとき。",
  "終わりを初めて知ったとき。",
  "ずっと涙を流していたとき。",
  "命をやっと理解したとき。",
  "すべては遠く彼方の軌跡。",
  "まぶたの裏に宿るもの。",
  "何度も浸ってって、それでも全く擦り切れない。",
  "思い出って、褪せないものね。",
  "ついさっきのことみたい。",
  "どんな時間も、その情景も、記憶にちゃんと刻まれている。",
  "それがお願いだったから。",
  "でも今になって考えてみたら、あなた、惜しいことをしたのかも。",
  "お願いなんてされなくたって、私、きっと憶えていたわ。",
  "あんなに楽しかったんだもの、忘れるはずがないじゃない。",
  "でも、そんなことも承知の上で、憶えておいて欲しかったのなら。",
  "それならとても、嬉しいわ。",
  "ちょっと照れくさくなっちゃうくらい。",
  "思い出が語り掛けてくる。",
  "次々浮かんで消えていく。",
  "ひとつ残らず忘れない。",
  "どれも細やかな色彩で、どれも鮮やかな感触だった。",
  "そのすべてが愛おしい。",
  "さあ！もうすぐラストスパート。",
  "ありったけを込めるとしましょう。",
  "響き渡ってよメヌエット。",
  "例え聞こえていなくても、誰もの心に残るくらいに。",
  "命ってなんだろう。",
  "その答えを私は得ている。",
  "命とは涙するもの、それを飲み込んで進むもの。",
  "誰かと共に過ごすために、時にはくだらない嘘を吐く。",
  "何かのために生きている。",
  "見つけるために生きている。",
  "何か大切なもののために、どんな恐れも振り払って、手を伸ばすことができるもので。",
  "手にしたそれがいつか零れて、後に残らぬものだとしても、美しいと、そう信じてる。",
  "ちっぽけだけど、弱くないもの。",
  "涙を越えて強くなるもの。",
  "あれ、だったら。",
  "もしかして、わたしって――ひとつ、気が付いたことがあって。",
  "わたしは緩く微笑んだ。",
  "それは、思い上がりかもしれないけれど。",
  "そうであったらいいなぁと、そんな願いを心に刻む。",
  "お揃いって、嬉しいものね。",
  "わたしはぽそりと呟いた。",
  "身体は熱い。",
  "胸が脈打つ。",
  "思い込みでは、きっとないはず。",
  "そういえば、前から思ってたことがあるの。",
  "これは絶対有り得ない、そんな『もしも』の話だけれど。",
  "言葉にするのは恥ずかしい。",
  "でも、せっかくだし言っちゃうわ。",
  "もしも、終わりに先があるのなら。",
  "そんな希望があるとするなら。",
  "また、どこかで会いましょう。",
  "できれば今度は、あなたの方から迎えに来てね。",
  "いつまでだって待っているから。",
  "わたしの名前をきっと呼んでね。",
  "そんないつかを夢に見る。",
  "手の届かない空想を、胸に秘めて信じている。",
  "賢くないけど、これは幸せ。",
  "信じることも悪くはないわ。",
  "だって、それがわたしたち。",
  "だものね。",
  "音色はもうすぐピリオドへ至る。",
  "終わりはそこに迫っている。",
  "わたしはそれを見据えてられる。",
  "ふうん。",
  "なんでか不思議と怖くないものね。",
  "あなたもきっと、こうだったのね。",
  "うん。",
  "なんだか満足よ。",
  "この思い出を、抱えてるから。",
  "いつかすべては終わるけど。",
  "そこに意味はないけれど。",
  "それでも確かに美しい。",
  "大事なものは手のひらに。",
  "創ったものは指先に。",
  "仄かな熱は胸の。",
  "わたしは私を憶えてる。",
  "それだけあれば、怖くはないわ。",
  "あ、そうそう忘れてた。",
  "これは言葉にしておかなくちゃ。",
  "溢れんばかりに伝えたいこと。",
  "「みんなみんな、大好きよ。",
  "わたし、ずっと観てたんだもの！」",
  "終わりにはやはり笑顔が似合う。",
  "これも教えてもらったこと。",
  "どうしようもなく、涙はあるけど。",
  "それでこその命と識った。",
  "「だったらさ。",
  "君にとっての大事なものも、ちゃんと見つけられたかい？」",
  "――――。",
  "音が聞こえる。",
  "音が聞こえた。",
  "当然なのに何かがおかしい。",
  "わたしが弾いてるはずなのに、そうだという確信が無い。",
  "無意識に、無自覚に。",
  "体は動いてピアノを弾く。",
  "意識は別を向いている。",
  "どこからだろう。",
  "音が聞こえた。",
  "どうしてだろう。",
  "声に聞こえた。",
  "なんだかよくわからないけど、どこか夢を見ているみたい。",
  "だからか少し、言葉を零す。",
  "誰かひとりに聞こえるくらい。",
  "「もちろんよ。",
  "たくさんあって溢れるくらい、多くのものを見つけたわ」",
  "あなたのおかげよ、ありがとう。",
  "あぶくの想いは胸ではじける。",
  "ひどく小さな、幻でした。",
  "長い演奏はようやく果てる。",
  "察して指は、惜しみまじりに鍵を沈める。",
  "いつまでも続くものはない。",
  "けれど、それは決して悪いことじゃない。",
  "始まらないと終わらぬように。",
  "終わらなければ始まりはない。",
  "気付けばこんなに当然のこと。",
  "もっと早くに気付くんだった。",
  "でも、そうね。",
  "弾き終えるのが怖かったのは、この曲が本当の本当に、一番大事なものだったから。",
  "なら、まあ、悪くはないわ。",
  "それじゃあね、メヌエット。",
  "人差し指で別れを鳴らす。",
  "――なぁんだ。",
  "ばかみたい。",
  "たった一度、曲が終わったところで、好きでなくなるはずなかったのにね？そうして遂に指は止まる。",
  "残滓に揺れる余韻は僅か。",
  "静まるようにピアノは黙る。",
  "でも、そこでは終わらせない。",
  "もうひとつだけ付け足して、それを最後にしておこう。",
  "それくらいの猶予はあるわ。",
  "労うようにピアノを撫でた。",
  "楽しかったわ、ありがとう。",
  "やっぱりピアノは最高ね。",
  "まあ、わたしが創った曲だし、当然と言えば当然だけど。",
  "でも、どうだろう。",
  "わたしが弾いたこの音色、ちゃんと届いていたかしら。",
  "聞こえるはずはないけど、それでもって思っちゃうのは、ちょっと未練がましいかもしれないわね。",
  "でも少しくらい許して欲しいわ。",
  "だってすっごく頑張ったんだもの。",
  "一番は譲れないけれど、二番目には良い演奏だったはず。",
  "失敗なんてどこにもない、完璧なピアノだったでしょう？それも全部、あなたたちに向けたものだから、光栄に思ってもいいのよ。",
  "なんて。",
  "それもやっぱり、聞こえてないか。",
  "大袈裟ぶって、恭しく。",
  "いつか見たように頭を下げる。",
  "もったいぶって口を開く。",
  "思いがけずに涙が落ちた。",
  "ここは静寂。",
  "醒める夢。",
  "走馬灯すら背を向け去った。",
  "やおら、瞳を閉じるのみ。",
  "怖いとも、悲しいとも、もうあんまり感じない。",
  "心はとても凪いでいる。",
  "やれることはすべてやったと、誇りに似た自負がある。",
  "ああ、でも。",
  "やっぱり。",
  "うん。",
  "寂しいのだけは、誤魔化せないなぁ。",
  "涙はやっぱり止まらなかった。",
  "「これにて、メヌエットは終わりです。",
  "ご清聴、ありがとうございました」",
  "それが最期。",
  "世界は終わり。",
  "此処にはひとつピアノがあるだけ。",
  "命になった、わたしの物語。",
  "「命を編んでよメヌエットすべてを愛して終えるくらい」"];

var output = [
  ["くだらない、くだらない。",
    "世界はすべてくだらない。",
    "踊るように、舞うように。",
    "クルクルクルクル私は謳う。",
    "つまらない、味気ない、見ていられない、意味がない。",
    "それは真理。",
    "おかしいの、みっともないのに、生きてるなんて。",
    "離れたところで見下して、そうしていつもひとり勝ち。",
    "偉ぶっているやつも、落ちこぼれてしまったやつも、結局何も変わらない。",
    "だってあなたたち終わるじゃない。",
    "みんなみんな、絶対に。",
    "意味なんて何も残らないのに、どうしてそんなに必死なの。",
    "価値なんて薄れて消えるのに、どうしてそこまで躍起なの。",
    "あはははは、ばかみたい。",
    "きっと、どこかくるっているのね。",
    "これ以上なく哀れだわ。",
    "涙を流して、命に縋って、何になるというのでしょう。",
    "そこには常に、終わりがあるのに。",
    "クルクルクルクル私は回る。",
    "流れる曲はメヌエット。",
    "これ以外は好きじゃない。",
    "私と同じ名のこれくらいしか、私は贔屓していない。",
    "世界を観て、嘲って。",
    "私は笑って悦に浸る。",
    "あはは、ほんとにおかしいの。",
    "いつまでだって、飽きないわ。",
    "床に臥せった病人も、誰もが羨む有名人も、大して違いもないのに差をつけて。",
    "悔しがって、誇らしがって。",
    "滑稽。",
    "したくもなさそうな愛想笑いがそんなに楽しい？嘘をついて馴れ合ってまで居場所が欲しい？才能無いこと続けて、夢ばかり見ているの面白い？あなたたち、思っていることとやってること、たいてい逆ね。",
    "笑えるわ。",
    "短い時間、そんなことに使っていていいのかしら。",
    "救えない。",
    "くだらない、つまらない、くるっている、ばからしい。",
    "いつもの通り思うまま。",
    "何回目かのそのひとつ。",
    "ずっと流れていた、メヌエットが、止んだ。",
    "なるほど、世界が終わったらしい。",
    "呆気のない終わりだった。",
    "ふーん、そう。",
    "そうなのね。",
    "終わっちゃったのね、まあいいわ。",
    "白紙みたいで、つまらない。",
    "いつも誰かが弾いていたメヌエットはもう流れない。",
    "世界が終わることは知っていたはずだけど、ちょっと困った。",
    "何もないのは、寂しいものね。",
    "そうだ、自分で弾けばいいじゃない。",
    "すぐに出来るわ、そのくらいなら。",
    "すぐにピアノを用意して、そこにそっと指を乗せる。",
    "押し込めば音が鳴る。",
    "とても単純。",
    "でも、どうすればメヌエットになるかしら。",
    "分からないなら試してみよう。",
    "他にやることもないのだし。",
    "白の鍵を適当に押す。",
    "すると低めの音が鳴る。",
    "なんだかちょっと面白い。",
    "すべての音を鳴らしていって、知っている音を増やしていく。",
    "どこを押せばどの音が鳴るか、次第に分かるようになる。",
    "記憶の中のメヌエットを思い出して、それと同じ音を弾いてみよう。",
    "始めは人差し指だけで、拙いながらも丁寧に。",
    "それにもやがて慣れてきた。",
    "今度は人差し指だけでなく、指のすべてを躍らせる。",
    "ゆっくり、じっくり、馴染ませて。",
    "そうしてメヌエットを編んでいく。",
    "単調な音の連なりに抑揚をつける。",
    "リズムを取ってみたりして。",
    "情緒を持たせるために、鍵盤に激しく打ち込んで。",
    "何度も何度も繰り返す。",
    "幾星霜そうしていて、やっとメヌエットが流れ始める。",
    "前に流れていたものと、まったく同じその音色。",
    "ああ、これよこれ。",
    "長くご無沙汰だったけど、遂にやってやったわ！通して一度弾いてみる。",
    "心地の良い達成感。",
    "これまでの苦労もなんのその。",
    "弾き飛ばしてよメヌエット。",
    "左と右の指を操って。",
    "音は軽快。",
    "気分は爽快。",
    "それは何にも勝る喜びで、大きく大きく笑みが零れる。",
    "自分で弾くのも楽しいものね。",
    "いつまでだって、続けられそう。",
    "愉快になって長々と。",
    "ずいぶん弾いていたけれど、何故だか少し物足りない。",
    "不思議に思って記憶を覗けば、抜け落ちていたのは躍動だった。",
    "困ったわ。",
    "これじゃあちっとも動けない。",
    "ピアノを弾きながら、踊るなんて。",
    "どう考えてもできやしない。",
    "困ってしまって途方に暮れる。",
    "どうやらここで行き止まり。",
    "あーあ。",
    "つまらない。",
    "ぽんと押したらピアノも嘆いた。",
    "突然思い出したけど、終わった世界は戻ってこない。",
    "あのくだらない世界でも、無くなっては困りもの。",
    "そう思うと恋しくなって、ちょっといじけて下を向く。",
    "あ、ならつくってしまえばいいじゃない。",
    "名案ね！跳ねるように立ち上がる。",
    "人差し指を横に振って、一本真っ直ぐ線を引く。",
    "それを始まりとして、世界をひとつ、つくり始める。",
    "もう一度、メヌエットを流すために。",
    "それはひどく単純な作業。",
    "初めの線を球にして、必要なものを足していく。",
    "前の世界に近づけるために、良いも悪いも一緒くた。",
    "なんでもかんでも素にする。",
    "捏ねて混ぜて伸ばして薄めて、世界はそうしてつくられる。",
    "なかなかな出来ね。",
    "悪くないわ。",
    "初めてにしては良い出来でなんだかちょっと誇らしい。",
    "せっかくだから、この世界はメヌエット。",
    "そう名付けることにした。",
    "そのための世界だし、ぴったりね。",
    "あとは待つだけ、メヌエットが流れるまで。",
    "でもそれだけはつまらないから、鍵盤を弾いて眺めてる。",
    "たいへんそうな命たち。",
    "汗水たらして働いて、前見たときと様子が違う。",
    "ふうん。",
    "ずっと同じことをしているようで、少し違うのね、あなたたち。",
    "まだまだ当分、メヌエットは流れそうにない。",
    "悟って、前みたいに世界を観てる。",
    "服も着ずに外を歩いて、たまに獣に襲われる。",
    "同じ仲間で相争って、それで両方共倒れ。",
    "適当に物を食べ漁って、毒に当たってよく悶えてる。",
    "ため息でたくさん。",
    "頭が悪いのよ、あなたたち。",
    "それでも馬鹿にできないのは、メヌエットのためだった。",
    "それを弾いてくれないと、いつまで経っても踊れない。",
    "仕方ないから我慢して、ずっとこうして眺めてる。",
    "終わって、泣いて、悲しんで。",
    "それでもずっと命を紡ぐ。",
    "なにもしなくても勝手に進む。",
    "その理屈がよく分からない。",
    "そんなに悲しそうなのに、よく諦めないわね、あなたたち。",
    "つまずいたってへこたれず、失ったって笑いあう。",
    "そのくせどこか不満顔。",
    "楽しいのか悲しいのか、結局どっちか分からない。",
    "やっぱりどこか、くるってるのかしら。",
    "じっとしばらく眺めていると、どんどん数が増えていった。",
    "次第に頭も良くなって、ちょっとのことじゃ終わらなくなった。",
    "丈夫な家や文字ができて。",
    "そうして豊かになっていく。",
    "よくやったと喜んで、はしゃいで思わず手を叩く。",
    "この調子だと、ピアノだってもうすぐね。",
    "そしたら後はどうだっていい。",
    "前みたいに、気ままに回って嘲るわ。",
    "そんないつかに心が躍る。",
    "さあ、あとちょっとよと嘯いて。",
    "割とあっさりピアノは出来た。",
    "音楽だって普及した。",
    "有象無象の音の響きが、今も世界を覆ってる。",
    "だけど、どうしても。",
    "メヌエットだけは流れてこない。",
    "しばらく待っても流れないから、仕方がないと腰を上げた。",
    "どこかに、弾けるやつをつくらないとね。",
    "面倒だけど、仕方ないわ。",
    "思えば、干渉するのは初めてだった。",
    "ずっと眺めてきたものだから、どんなものかはわかってる。",
    "適当なやつに音を聞かせて、弾けるように仕立てよう。",
    "そうすれば、きっとなんとかなるでしょう。",
    "観ていた世界に飛び込んだ。",
    "そうしてひとつに溶け込んだ。",
    "とりあえず、適当に。",
    "目についたやつの所に向かう。",
    "もちろん、ピアノを弾いてるやつの。",
    "「あなた、メヌエットを弾いてくれない？もちろんちゃんと教えるから」",
    "「わああ！え？誰？どこから？！」",
    "第一印象はうるさいの。",
    "声を掛けてやったのに、答えもせずに騒ぎ散らかす。",
    "礼儀も何もないやつだった。",
    "そういうの、大事にしていると思ってたけれど。",
    "どっちにしろ、面倒ね。",
    "「いや、何か答えてよ……黙ってられても困るんだけど」",
    "「だから、メヌエットを弾いてって言ってるの」",
    "「まずメヌエットって何……」",
    "腹立たしいことに困惑した顔で、金色の髪をした男の子は呟いた。",
    "つまるところ、それが出会い。",
    "思った通りにいかなくて、滞って厄介だった。",
    "「ええと、つまり君は神様みたいなもので、メヌエットってのを弾かせるために世界をつくったっていうの？」",
    "「だから、そう言ってるじゃない。",
    "どうでもいいわ。",
    "さっさと弾いて」",
    "「ご、強引すぎる」",
    "「嫌なら、他のやつでもいいわ。",
    "ここ、あなた以外に誰かいないの？」",
    "「この家には他に誰もいやしないよ。",
    "お父さんもお母さんも死んじゃったから、僕独りだ」",
    "「ふうん、そうなの。",
    "アテが外れた」",
    "どうやら、来るところを間違えたらしい。",
    "面倒くさい男の子。",
    "その独りしかいないのでは話にならない。",
    "他で良さそうな場所はあるかしら。",
    "適当に選り好んでいた。",
    "そんなとき、うっとうしくも声が割り込む。",
    "「ねえ、メヌエットってどんな曲なの？」",
    "「あら。",
    "興味あるの、あなた」",
    "「うん。",
    "音楽、好きだから。",
    "知らない曲は聞いてみたい」",
    "「そう。",
    "まあいいわ。",
    "聞かせてあげる」",
    "どいて。",
    "そう言うと、何故だか微妙な顔をする。",
    "男の子は座っていた椅子を譲り、ピアノを私に明け渡す。",
    "ずっと世界を観るのにかまけていて、ピアノは長いこと弾いていなかったけれど、鍵盤に指を乗せると自然と弾ける気になるから、不思議。",
    "指が動く。",
    "白に跳ねて黒を圧す。",
    "転がるように鍵盤は歌う。",
    "音の名前はメヌエット。",
    "私と同じ名を冠するもの。",
    "一つたりとも誤らず、ピアノはその身を響かせる。",
    "綺麗に線をなぞるが如く。",
    "「はい、これがメヌエット」",
    "「へぇ、いい曲。",
    "なんだか、始まりと終わりを混ぜ合わせてしまったみたい。",
    "だけど明るくて、僕は好きだ」",
    "「じゃ、弾いてみて。",
    "聞いてたでしょう、今の音？」",
    "「無茶ぶり！できっこないよそんなこと。",
    "君だって、すぐ弾けるようになったわけじゃないだろう？」",
    "「……確かにそうね。",
    "じゃあ、仕方ないから時間をあげる」",
    "「ははは、そりゃどうも」",
    "そう全然嬉しくない顔でひとつ笑う。",
    "愛想笑いって、わけわからなくて気持ち悪いわ。",
    "嘘っぽい。",
    "そんなこんなで、彼に来る日も来る日も音を教える。",
    "自由な時間は少なくて、わずかな時間ピアノに触れる。",
    "働きずくめの疲れた体は、鍵盤だけが生きがいみたい。",
    "そんな小さな体に詰め込むみたいに、メヌエットを与えていく。",
    "いつか、流れ出すことに期待して。",
    "「ねえトモダチって、一体何？あれ、よくわからないんだけど」",
    "「あー、あれね。",
    "残念だけど僕も知らない。",
    "でも楽しいし、いいものらしいよ。",
    "僕も欲しいんだ。",
    "羨ましいね」",
    "「そんなにいいものでもないと思うわ。",
    "だってあれ、嘘ばっかり吐いてるんだもの。",
    "ほんとのことなんてほとんどないわ」",
    "「いいじゃない。",
    "嘘を吐いてるってことは、大事なものがあるってことだ。",
    "それを壊さないようにしてるのさ。",
    "それってとっても、優しいことだ」",
    "「ふうん。",
    "やっぱり、よくわからない」",
    "「いつかわかるさ。",
    "それじゃ、今日はおやすみ」",
    "おやすみなさいを返す代わりに、メヌエットを緩く弾く。",
    "それはちょうど子守歌。",
    "弾き終わる頃に寝息がすぅと引継ぎをして、夜はそうして深まってゆく。",
    "それが習慣になっていく。",
    "「ねえ、あなたたちってどうして生きてるの？結局終わりがあるのなら、どこで終わっても同じじゃない？」",
    "「酷いこと聞くなぁ、君は。",
    "……そうだね、きっと見つけたいものがあるんだ。",
    "好きなものだったり、綺麗なものだったり、良いものだったり、もしかすると悪いものだったり。",
    "何かを見つけて大事にしたくて、僕たちは宛てもなく、生きてるんだと思うんだ」",
    "「それは、いつかあなたたちの手から零れ落ちるものよ。",
    "ずっとは持っていられないわ。",
    "それでも関係ないっていうの？」",
    "「そうさ。",
    "そんなのは関係ない。",
    "いつか失って忘れるものでも、見つけたことには価値がある。",
    "僕はそうやって信じてるんだ」",
    "「信じるっていうのも、よくわからない。",
    "それって全部、不確かで過度な期待じゃない？賢くないと思うわ、そういうの」",
    "「僕は愚かなのって、そう悪いことじゃないと思う。",
    "だって賢くちゃ出来ないことって、多いもの。",
    "それじゃ、今日は寝るよ。",
    "おやすみ」",
    "「もうすぐ全部弾けるようになるかな、メヌエット。",
    "あと少しだと思うんだけど」",
    "「……まだまだよ。",
    "あのとき聞かせたのは途中まで。",
    "あなた、ちょっとの時間しか練習できないんだから、先は長いわ」",
    "「そっか……じゃあもっと、頑張らないとね。",
    "弾けるようになったら、やりたいことがあるんだ」",
    "「そうなの。",
    "私もあなたには早く弾けるようになって欲しいけれど……まあ、焦っても仕方ないわ。",
    "地道にやるのが一番よ」",
    "「確かにそれは間違いないね。",
    "じゃあ、明日に備えてもう寝ることにする。",
    "おやすみ」",
    "「そういえば、僕と君って大体同じ歳になったよね。",
    "や、体つきがだけど」",
    "「そうね、目線がちょうど同じくらい。",
    "随分と時間が経ったのね。",
    "長く感じる。",
    "こんなの、ひとりならあっという間なのに」",
    "「えー、そうかな。",
    "僕は君と出会ってから毎日凄く楽しくて、ここまであっという間だったけど」",
    "「知らなかったのよ……時間が、こんなに長いものだなんて」",
    "「知らないことだらけだよね、君って。",
    "何でも知ってる風なのに、ちょっとおかしい」",
    "「それは……！あなたたちが、おかしいだけよ」",
    "「ごめんごめん、調子に乗っちゃった。",
    "追いつけたみたいで嬉しかったんだ。",
    "まだ身長だけだけど。",
    "それじゃおやすみ、また明日」",
    "「そういえばあなた、前に見つけたいものがあるとか言っていたけれど、何も探してないじゃない。",
    "だったら、何のために生きているの？」",
    "「ん？あ、あー。",
    "昔したね、そんな話。",
    "それはね、探すものじゃないからさ。",
    "生きてる途中で自然と見つかるから、大切にしたくなるものなんだ」",
    "「そういうもの。",
    "でも、それなら見つからないこともあるでしょう。",
    "それでもいいの？」",
    "「いや、きっと見つかるさ。",
    "目を閉じなければ、誰にでも。",
    "それに、僕はもう見つけてるからね」",
    "「へえ、そうなの。",
    "意外だわ。",
    "あなた、ずっと似たような毎日をしてるじゃない。",
    "働きづくめ。",
    "見つかるものなんて、たかが知れてると思ったけれど。",
    "……それで、何を見つけたの」",
    "「まあ、近すぎると気が付けないものもあるって話。",
    "おやすみ」",
    "「ちょっと、話は終わってないわ」",
    "「僕の中では終わったの。",
    "おやすみ」",
    "「あなた、嘘を吐いたことってある？」",
    "「そりゃあるよ。",
    "くだらないことだけどね」",
    "「なんで嘘なんて吐くの？思っていること、全部正直に話せばいいじゃない。",
    "言わないと分からないことでいっぱいなんでしょう？そういうところもよくわからないのよね、あなたたちって」",
    "「確かに正直なのは良いことさ。",
    "だけど、それだけじゃやっていけないんだよ、僕たちは。",
    "嘘にも色々種類があってだね。",
    "例えばそれは人とやってくための噓、誰かを傷つけないための嘘、自分を騙すための嘘。",
    "そういうのが無かったら、悲しくて生きていけないよ」",
    "「……ずっと観てきたけれど、生きることって悲しいことよ。",
    "誰も彼も、笑うより悲しそうな顔を多くしてたから。",
    "それが嫌なら、向いていないわ」",
    "「そのために、嘘があるんだ。",
    "悲しいことがあったって、なんとか自分を騙すんだ。",
    "そうして今日を誤魔化して、僕らは夜に眠るのさ」",
    "「あなた、誕生日って知っている？」",
    "「え、もちろん知ってるよ。",
    "ひと月先に十六になるんだ、僕。",
    "だからどうってわけないんだけど」",
    "「そう、ならよかった。",
    "誕生日にはパーティーをやるものなのでしょう？やってみたいわ、やりましょう」",
    "「へえ、興味あるんだ。",
    "珍しい。",
    "くだらないとかつまらないとか、いつもみたいに言わないの？」",
    "「あれはちょっと例外よ。",
    "だって、誕生日のパーティーは嘘がなくて楽しそう。",
    "前から少し、気になってたの」",
    "「そっか。",
    "じゃあやってみよう。",
    "なんだか久しぶりな気がするよ。",
    "お父さんもお母さんもいなくなってから、ずっとひとりだったもんなぁ」",
    "「なら、その日は弾くのを止めにしましょう。",
    "そうしないと、時間がないわ」",
    "「えー。",
    "練習は無くしていいけれど、僕、君が弾くのを聞きたいな。",
    "寝る前聞かせてくれるけど、いつも眠りが先に来る。",
    "あれって結構悔しくて、最後まで聞いてられないのが不満でさ。",
    "君のがちゃんと聞けたなら、もっと上手くなれると思うんだけど」",
    "「……仕方ないわね。",
    "考えておく」",
    "「ほんと？ありがとう。",
    "君のピアノ、綺麗だからさ。",
    "それが聞ければ、最高だ」",
    "「誕生日のパーティーって、思っていたより普通の日ね。",
    "何もかも、特別になるわけじゃない。",
    "正直いくらか拍子抜け。",
    "こんなの、よく楽しんでられるわね」",
    "「ええ、楽しいじゃない。",
    "まあ僕、あんまりお金とか持ってないから、豪華なことはできないけれど。",
    "生まれた日を祝ってくれるやつがいるだけで、嬉しいし、楽しくなるのさ」",
    "「そういうものかしら」",
    "「うん。",
    "そういうものなんだ……ねね、ほら。",
    "早く弾いてよメヌエット」",
    "「はぁ、わかったわよ。",
    "今から弾くからしっかり聞いてなさい」",
    "「もちろんだよ。",
    "ああ、とっても楽しいな。",
    "こんなに楽しいの、三人でピアノを弾いたときぶりだ」",
    "「これで、こうね」",
    "「うわあ、これまた難しい……ん。",
    "でもこれでどう？」",
    "「いいわね。",
    "悪くないわ」",
    "「じゃあこの続き、教えてよ」",
    "「……もう、ないわ。",
    "これでおしまい」",
    "「え？本当？！じゃあ僕、これで弾けるようになったってことだ！」",
    "「そうね。",
    "一度通しで弾いてみなさい。",
    "ここで聞いていてあげるから」",
    "彼はふぅとひとつ息をついて。",
    "鍵盤へと向き直る。",
    "一拍おいて音が鳴る。",
    "教えたとおりの音を奏でる。",
    "つらつらと、水が低きに流れるように。",
    "それが当然のことかの如く、メヌエットが世界に産声上げる。",
    "ああ、このためにどれだけ時間をかけただろう。",
    "嬉しくて嬉しくて。",
    "知らず、にやけてしまいそう。",
    "だってじっと待ったんだもの。",
    "誰かが弾いてくれるまで。",
    "ずっとずっと、流れ出すのを待っていた。",
    "メヌエットは、しかと流れる。",
    "それを身体で感じ取り、足を静かに動かした。",
    "クルクルクルクル私は回る。",
    "おかしなことをしてた気分。",
    "遠回りに、また遠回りを重ねたわ。",
    "だけど不思議と、心地いいのは、なんでかしら。",
    "しなくていいことをしたのが初めてだから？ああ。",
    "そういえば、嘘を吐いてみたのも、これが初めてだったわね。",
    "どうでもいいかと思考を止める。",
    "心のままに体は振れる。",
    "ピアノ越しに彼が見ている。",
    "たのしくて、ゆかいで、おもしろくって、とまらない。",
    "それでも終わりはあるもので、曲はそろそろ終点に。",
    "最後の一音をきちんと鳴らして、彼は恭しく頭を下げる。",
    "それに合わせて動きを止めた。",
    "「これにて、メヌエットは終わりです。",
    "ご清聴、ありがとうございました」",
    "誰かに向かって語り掛けるみたいにして。",
    "彼はそうして曲を閉じた。",
    "「それ、なあに？」",
    "「お父さんとお母さんの真似。",
    "これ、ずっとやりたかったんだ。",
    "二人ともピアノを弾く人だったから、憧れで。",
    "思ったより長い時間かかっちゃったけど、やっとできた」",
    "笑う彼は疲れたように、手をぶらぶらと振っていた。",
    "そこはかとない満足感に包まれて、顔を合わせて有頂天。",
    "どっと肩の荷が下りた感じ。",
    "「君、やっぱり綺麗だね。",
    "くるくる回るだけで画になるなんて。",
    "良いものを見た気分だ」",
    "「そう、それはどういたしまして。",
    "でも、あなたのピアノも良かったわ。",
    "ありがとう」",
    "「わ。",
    "君がそんなこと言うなんて。",
    "ますます良いものを見た気分。",
    "今日はとっても良い日だな」",
    "でも、とうとう理由が無くなった。",
    "ここに居たのは、メヌエットがどこにも流れなかったから。",
    "ここでの時間は、もう終わり。",
    "「僕もう一回弾くからさ、君、さっきみたいに回ってよ。",
    "出鱈目でだっていいからさ。",
    "夜に映える、望月みたいな。",
    "綺麗な君を見ていたいんだ」",
    "「わかったけれど、これで最後。",
    "メヌエットは流れたもの。",
    "そろそろ戻って、また前みたいにしたいのよ」",
    "「……そっか。",
    "ああ、そうか。",
    "そうだよね。",
    "君も、いなくなって、しまうのか……。",
    "うん、なら」",
    "少しだけ、寂しそうな顔。",
    "珍しい。",
    "でもそれはすぐに見えなくなって、いつもの笑顔であなたは言った。",
    "「最後には、とびきりのものを弾かなきゃね」",
    "空から月が照らしてた。",
    "光を浴びた晴れ舞台。",
    "彼が奏でて私が躍る。",
    "明かりはいたく上等で、爪の先まで際立たせる。",
    "頭で跳ねるあなたの髪が、その分ちょっと不格好。",
    "でも何より綺麗な金の髪は、私の密かなお気に入り。",
    "だからかすべてが完璧で。",
    "ひとつだって、不満はないわ。",
    "「ねえ。",
    "僕、毎日忘れず弾くからさ。",
    "君、それをずっと聞いててくれよ」",
    "指は滑らか。",
    "足は軽やか。",
    "刻むリズムは遥かに自由。",
    "とびきりというに相応しい、笑えるくらいに楽しい時間。",
    "長かった日々をここで締めくくる。",
    "朝の日差しが追いつく前に。",
    "そこで彼とはさようなら。",
    "前と同じところへ戻る。",
    "まあ、気が向いたら、また来るけれど。",
    "ふうん。",
    "前より面白いじゃない。",
    "何かあったの、あなたたち。",
    "再びずっと世界を観てる。",
    "あくせく動く命を観てる。",
    "それは前より面白い。",
    "何も違わないはずなのに、どこか見どころが増えたみたい。",
    "意味もないのに笑って泣いて。",
    "価値もないのに比べて驕って。",
    "そんな営みが面白い。",
    "よくわからないけど、頑張ってるじゃない、あなたたち。",
    "そんなに悪いものじゃないわね、これも。",
    "ずっと観ていて飽きないわ。",
    "前とは違う意味だけど。",
    "愛想笑いや嘘吐きは、世界にけっこう溢れてる。",
    "まあでもそれも一興だ。",
    "仕方がないみたいだし。",
    "無いとやってられないらしいから。",
    "メヌエットは今も流れている。",
    "いつの間に、世界に渡っていたみたい。",
    "私の教えたひとつの曲は、そうして広く知られてた。",
    "それは彼が弾いていたから。",
    "ずっとひとりで弾いてたものが、より多くに知られたのでしょう。",
    "名を馳せてったメヌエット。",
    "でも、前よりそれを聞いてない。",
    "それはこだわり。",
    "日に一度流れる彼からのだけ、私は欠かさず聞いている。",
    "他は全然聞いてない。",
    "意味ないけれど、それでよかった。",
    "クルクルクルクル私は回る。",
    "気分が良くて止まりはしない。",
    "世界を観ながら音を聞く。",
    "そうして全てが楽しくなって、愉快に笑って時間が過ぎる。",
    "分からないことは多いけど、醜いものは多いけど。",
    "なんだか全部、無駄ではなくて。",
    "どんな顔も何かに耐えて、何かを見つけたそうにしていると、そう感じてしまったから。",
    "だからかずっと世界を観てる。",
    "穏やかに慈しんで、前では有り得ないくらい。",
    "なんだかそれって、素敵なことじゃないかしら。",
    "そんな風にしていたあるとき。",
    "ちょっと気に食わないことあって、前ぶりに世界へ潜る。",
    "僅かに心を躍らせて。",
    "ひとつ、とっておきの。",
    "言いたいことも引き連れて。",
    "「あなた寝過ぎよ。",
    "最近、めっきり弾いてないじゃない。",
    "前まで毎日弾いていたのに。",
    "つまらないわ」",
    "「あ、れ？……やあ、君か。",
    "久しぶり。",
    "もう会えないかと、思っていたよ」",
    "私がかつて教えた彼は、白いベッドで上体だけ起こして、こちらを見た。",
    "目を細めて、眩しいものを見ているみたいな、そんな不思議な顔をして。",
    "「僕のピアノ、ずっと聞いてくれてたかい？寒い冬の日も、暑い夏の日も、ずっと弾くよう頑張ったんだけど」",
    "「もちろん全部聞いてたわ。",
    "聞いていたからここに来たの。",
    "だって、途切れちゃったから。",
    "怠惰すぎるのはいただけないわ。",
    "毎日弾くって言ってたの、もう忘れてしまったの？」",
    "「……そっか。",
    "ずっと聞いてて、くれたのか。",
    "だから、今来てくれたのか。",
    "ああ、なら……なら、よかった。",
    "不安だったから。",
    "ずっと」",
    "そんなの、当たり前じゃない。",
    "言うと、彼は本当に何か眩しいものでも見ていたのか、両手で目元を覆ってしまう。",
    "それでしばらく黙りこくる。",
    "微妙に噛み合ってないような会話。",
    "ちょっぴりムッとしそうだけれど、なんでか心は飛び跳ねて、嬉しい気持ちが泡立って。",
    "だから、許してあげることにした。",
    "まあ、あなただし、特別ね。",
    "「ねえ、せっかく来てくれたんだし、連弾しようよ。",
    "一曲さ。",
    "君が左で、僕が右」",
    "「やったこと、ないけれど……いいわ。",
    "なんだか楽しそう」",
    "彼はのっそり立ち上がり、ゆっくりピアノの方へ行く。",
    "途中で何かを落としたみたい。",
    "ポタポタ滴る透明が、狭く床を濡らしてた。",
    "それはキラキラ輝いて、眩しいくらいに光を放つ。",
    "「あなた、もしかして泣いているの？どうして？涙って、悲しいときに流すもののはずでしょう」",
    "「そうだった。",
    "君は知らないことばかりだったね、懐かしい。",
    "涙はね、嬉しいときにも流れるものさ。",
    "それにこれは、きっと音を良くしてくれる」",
    "触れ合うくらいに近づいた。",
    "すうと息を吸って直後。",
    "指が沈んだのは同時。",
    "それは合図。",
    "立派なピアノが目を覚まし、遅れることなく音は伴う。",
    "私が左で彼が右。",
    "片手二つは歪にあらず、いっそ調和を生み出して。",
    "とめどなく、流れておいてよメヌエット。",
    "思い出話を飾るくらいに。",
    "「そうだ。",
    "僕にも出来たんだよ、友達。",
    "たくさんね」",
    "「へえ、そうなの。",
    "私、未だに分かっていないのよ。",
    "どんなものだった？トモダチって」",
    "「そうだな。",
    "昔考えていたほど素晴らしいものではなかったよ。",
    "面倒なことは多くあったし、離れてしまったやつもいた。",
    "でもね、あれは必要なものだ。",
    "気が合うやつは大切で、喧嘩できるやつはもっと大切。",
    "完璧ではないけれど、それは誰だって同じだから。",
    "支えあってく友達って、宝物みたいなものだった」",
    "「あ、そうそう。",
    "メヌエット、けっこう広まっているでしょ、いろんなとこで。",
    "ずっとこれだけ弾いてたら、なんだか人気になっちゃって。",
    "これがきっかけで、いろんな人とも知り合えた」",
    "「あれにはちょっと驚いたわ。",
    "こんなに世界に巡るなんて。",
    "嬉しいけれど照れくさい。",
    "元は、私とあなたしか知らなかったのにね」",
    "「そうだねぇ。",
    "そういえば僕、他には曲を知らないんだ。",
    "この曲ばかり弾いていたから。",
    "なんだか少し変だよね」",
    "「いいじゃない。",
    "きっと、この曲が一番よ。",
    "だから十分。",
    "それに、私も知らないし。",
    "お揃いね」",
    "「うん、それは間違いないな。",
    "そうだ聞いてよ。",
    "僕、この曲だけ弾けるピアニストなんだ。",
    "父さんと母さんと、二人と同じピアニスト。",
    "ずっと昔からの夢だったけど、ちゃんと叶えてみせたんだ。",
    "……あれ、僕の夢のこと、昔の君に言ってたっけ？」",
    "「ちゃんと前に聞いていたわ。",
    "夢はピアニストだってことくらい。",
    "その理由だって覚えてる。",
    "あの家に大きなピアノがあったのも、あなたがそれを夢見たのも、親がピアニストだったから。",
    "違う？」",
    "「そうそう、よく覚えてくれてたね。",
    "そうだった、たくさんたくさん話したもんね。",
    "そんなことくらい、喋っていたか。",
    "なんだか、すべてが懐かしい」",
    "指はそのまま。",
    "視線は彷徨う。",
    "彼はいつかの過去をみて、私はピアノの傷を見る。",
    "どこか懐かしいと思えば、寂れたピアノは前のと同じ。",
    "「ピアノ、同じの使っているのね。",
    "けっこう古いものだから、すぐに換えるかと思っていたわ」",
    "「当たり前だよ。",
    "君と弾いたピアノだもの。",
    "換えるなんて有り得ない。",
    "このピアノもこの曲も、どちらも大事な僕の宝物」",
    "「そう言われると、悪い気はしないわ。",
    "考えてみれば、この曲は私にとっても宝物って言えるかも」",
    "「じゃあ、そこもお揃いだ。",
    "それにね。",
    "僕の人生には、いつだってこの曲が傍にあった。",
    "苦しいことも悲しいことも、だから乗り越えられたんだ。",
    "君が教えてくれた音。",
    "そのひとつひとつが僕を象る。",
    "まるで存在そのものに、編み込まれているみたいに。",
    "だから――」",
    "一瞬だけ言葉を区切る。",
    "噛み締めるような僅かな余韻。",
    "いとも綺麗な旋律が、その隙間から溢れてる。",
    "「――僕の命の奥からは、メヌエットが聞こえるはずさ」",
    "なんてね。",
    "いたずらっぽく彼は笑う。",
    "くしゃっとした、柔らかさ。"], [
    "会話と音楽。",
    "相反する二つの響きは不協な音色に成り得ない。",
    "長いようで、短くて。",
    "短いようで長い時間。",
    "ふたりで弾いた音楽は、いつものよりかお気に入り。",
    "夢中になって弾き浸る。",
    "目に映るのは流麗な指。",
    "彼のそれは前とは比べ物にならないほどで、なぜだか誇らしくなった。",
    "そうだった。",
    "ずっと弾いていたんだものね、あなた。",
    "私ほどではないけれど、しっかり上手になってるじゃない。",
    "嬉しいわ。",
    "「ひとつ、お願いがあるんだ。",
    "どうかな、聞いてくれる？」",
    "「仕方ないわね。",
    "聞いてあげるから、話してみなさい」",
    "「あのさ……ずっとずっと、忘れないで。",
    "僕と話したすべてのこと、君と弾いたすべての音。",
    "それを全部余さずに、憶えておいて欲しいんだ。",
    "思い出すことがなくてもいい。",
    "ただ、君の中に残しておいて。",
    "いつまでも、君には。",
    "君だけには、憶えておいて、もらいたくて」",
    "「わかったわ、簡単よ。",
    "憶えておけばいいだけなんて、変なお願い」",
    "耳に入るのはメヌエット。",
    "目に入るのは指捌き。",
    "私がいつか教えたもの。",
    "それを捉えて薄く微笑む。",
    "だからとは言わないけれど、私は彼の願いを聞いた。",
    "ああ、こうしているだけで気分が良いわ。",
    "酔うように、微睡むように。",
    "耳は傾き目は奪われる。",
    "「ああ……なら、安心だ。",
    "最期に会えて、よかったよ」",
    "「そんなに会いに来て欲しいなら、またちょっとしたら来てあげるわよ。",
    "あなたと話すの、私はそんなに嫌いじゃないし」",
    "見落とした。",
    "「これで、未練も無くなった……。",
    "思い残すことなんて、なにひとつだって、ありはしない……ほんとうの、ほんとうに。",
    "良い人生、だったとも」",
    "聞こえていたはずなのに。",
    "「声、小さくて聞き取りにくいわ。",
    "もっと大きな声で話してくれる？」",
    "大事なことには、気が付けないまま。",
    "「ねえ……ありがとう……傍にいてくれて、教えてくれて………」",
    "「ちょっと。",
    "重いわ、寄りかからないで」",
    "「………ずっと……楽しかったんだ…………幸せだった…………」",
    "「それに、声が小さいって言ってるじゃない」",
    "――さようなら、メヌエット。",
    "ちっぽけかもしれないけれど、とても幸せな人生でした。",
    "「手も止まってる。",
    "せっかくいいところだったのに、これじゃ台無し。",
    "どうしちゃった、の……………………？」",
    "ねえ。",
    "声をかけても、返ってこない。",
    "寄りかかったあなたは重い。",
    "カラダに力が入っていない。",
    "熱が、するすると。",
    "抜けていってしまう。",
    "動かない。",
    "なんで？そこでやっと気が付いた。",
    "今まで、浮かれてしまっていたからだ。",
    "話す時間は楽しくて、嬉しくて、舞い上がって、見えなくなっていたからだ。",
    "命に決まりがあることを。",
    "私はようやく、思い出す。",
    "綺麗な金色の髪はどこにもない。",
    "抜け落ちて白になった。",
    "張りのあった肌はどこにもない。",
    "皺くちゃに枯れている。",
    "輝いていた双眸はどこにもない。",
    "既に閉じてしまっている。",
    "私を見ていた命はどこにもない。",
    "どこにも、いなくなった。",
    "もう、なにもない。",
    "え、え、え、え……え？待って。",
    "ちょっとでいいから。",
    "ほんの少しだけでもいいから、時間をちょうだい。",
    "まだ、言ってなかったことが、あったのよ。",
    "それくらい、聞いていってよ。",
    "お願いよ。",
    "私、まだ言えてない。",
    "あなたにひとつ、嘘を吐いていたこと。",
    "本当は、メヌエットって、もっと短い曲だったの。",
    "今みたいに、一度弾いただけで疲れちゃうような曲じゃ、なかったのよ。",
    "声は無意味に虚空に響く。",
    "主を亡くしたピアノが軋む。",
    "でもあなたとお喋りするの、存外楽しかったから。",
    "途中から私が好きな音を付け加えて、つくって、引き伸ばして、繰り返して、整頓して、編んでいったの。",
    "メヌエットという曲を。",
    "まだ終わらないのってあなたの声に嘘を返して、ずっと続けばいいなって。",
    "そう思いながら。",
    "私、メヌエットを創りながら、あなたに教えていたのよ、知ってた？その問いに答える者はいない。",
    "開け放された窓から入ってきた風で、ベッドの上に遺された手書きの楽譜が、サラサラと。",
    "捲れて、閉じた。",
    "言いたかった、のに。",
    "それを知ったとき、あなた、どんな顔するんだろうって。",
    "ずっと、ずっと楽しみにしていたのに。",
    "とっておきだったのに。",
    "怒るかもなってちょっぴり恐れて。",
    "笑うかもなって期待して。",
    "喜んでくれるかもって、願っていたのに。",
    "安定を失ったカラダはいつの間にかずれ落ちて、離れてしまう。",
    "ドサ。",
    "音。",
    "それだけ。",
    "――ああ、そっか。",
    "あなた、終わってしまったのね。",
    "なにもない。",
    "けれどそこにあるのは、疑いようもない終わり。",
    "ふうん、そう。",
    "そうなのね。",
    "そうなのね、そうなのね。",
    "まあ命ってそういうものだし。",
    "これも別におかしくないわ。",
    "大丈夫よ、大丈夫。",
    "問題なんて、あるはずないじゃない。",
    "命が終わるところなんて、何度も観てきたはずだもの。",
    "悲しむなんて有り得ない。",
    "錯覚よ。",
    "いつもと同じに戻るだけ。",
    "今はちょっと、びっくりしたの。",
    "それだけよ。",
    "指先が震えて止まらないのなんて、すぐに収まってくれるはず。",
    "そうよ、すぐに収まるわ。",
    "大したことでは、ない。",
    "ないのだし。",
    "それは嘘。",
    "真っ赤な欺瞞。",
    "あまりに拙い防波堤。",
    "――零れた。",
    "無理よ、こんなの。",
    "耐えられるわけ、ないわ。",
    "だって。",
    "だって言わなかったじゃない、終わるなんて。",
    "おかしいわ。",
    "おかしいわよ。",
    "こんなに悲しくなるのも、それを知ってたはずのあなたも。",
    "あれ。",
    "わからない。",
    "なんで。",
    "こんなにわけがわからなくなるの。",
    "ねえお願いよ嘘って言って。",
    "もうそれは嫌いじゃないから。",
    "嘘を吐いてたって怒らないから。",
    "どうしていいかわからないの。",
    "こういうとき、どうしたらいいの。",
    "ねえ、教えてよ。",
    "答えて。",
    "知っていたはずだったわ。",
    "終わりがあることなんて。",
    "でもこんなの知らない。",
    "突き刺さるような痛みも、欠けたような空白も。",
    "こんなことってあっていいの？こんな絶望って抱えてられる？あああ、ああああああ。",
    "だって、もう会えないんでしょう。",
    "もう話せないんでしょう。",
    "もう弾けないんでしょう。",
    "もう、どこにもいないんでしょう。",
    "いない。",
    "あああああああああ。",
    "理解なんて、したくない。",
    "あなたこれを知っていたの？あなたこれを抱えていたの？こんなものが決まっていながら、命ってみんな生きてるの？あんなに楽しそうだったじゃない。",
    "最期まで普通だったじゃない。",
    "怖くなかったの？泣き出したくなかったの？だってそうよ。",
    "私より、何より。",
    "一番つらいの、あなたのはずでしょう？なんで。",
    "こんな。",
    "悲しいことがあると知って、今まで生きていられたの。",
    "ねえ、答えてってば。",
    "涙か何か。",
    "流れて止まらないそれは、世界をぼやかし滲ませる。",
    "終わる。",
    "終わった。",
    "終。",
    "不可逆。",
    "クルクルクルクル世界は廻る。",
    "何もせずとも勝手に巡る。",
    "停まらずいつも終わりへ向かう。",
    "それを、観ている。",
    "呆然と。",
    "何の為かもわからぬままに。",
    "やめて。",
    "終わって、泣いて、悲しんで。",
    "なんのそのと顔を上げてる。",
    "全て知ってた命たち。",
    "それでも意味なく足を動かす。",
    "いくつもいくつも踏み越えて、終わりに立ち向かっている。",
    "たいへんそうな命たち。",
    "弱くて脆くて短くて、儚いながらも生きている。",
    "わからない。",
    "何が理由で挫けないのか。",
    "喪失を背負ってられるのか。",
    "悲しみだけに溺れないのか。",
    "その答えを知るためだけに、私は今も命を観てるこんなもの。",
    "『汚れた服の少女』多くの悲しみがありました。",
    "多くの涙がありました。",
    "つらいこと、ばかりでした。",
    "厭なことで、いっぱいでした。",
    "良いことなんて一握り。",
    "それを抱えて生きました。",
    "傷のほうが多い人生。",
    "それなのに、どうしてでしょう。",
    "ふと、窓から覗いただけの、なんでもない、世界の色は。",
    "それだけで納得がいくほどの、ひとつの命に足るものなのです。",
    "悲しいだけの、はずなのに。",
    "『その日暮らしの少年』笑顔を絶やさず生きていた。",
    "泣いていると悲しいし。",
    "ままならないことでいっぱいだ。",
    "目を逸らさないとやってられない。",
    "良いことなんてほとんど無いから、笑顔はたいてい嘘だった。",
    "つらくならないための嘘。",
    "でも、それが悪くなくてさ。",
    "仲良いヤツと集まって、何も考えず騒いでいると、嘘笑いだって本当になる。",
    "それは偽りなく楽しくて、そんなときには決まってこう思える。",
    "ああ、生きるのも悪くない。",
    "どうしてこんなに、美しい。",
    "命を観た。",
    "世界を観ていた。",
    "始まりから今の今まで。",
    "怖かった。",
    "悲しかった。",
    "ひとつたりとも例外はなく、生きてるものはいつか消え去る。",
    "ひとつ命を観るたびに、それは重くのしかかる。",
    "命の不憫を知ってしまった。",
    "終わりの怖さを知ってしまった。",
    "メヌエットはもう弾けない。",
    "聞くことだってできはしない。",
    "だって始まると終わるから。",
    "それは、とても悲しいことだから。",
    "逃げている。",
    "しかして。",
    "それを背負って命は始まる。",
    "理解しながらも次へと託す。",
    "無意味も無価値も跳ね除けて、産声の音を響かせる。",
    "ずっと何故だかわからなかった。",
    "始まらなければ終わらないのに。",
    "そうすれば悲しみも何もないというのに。",
    "割に合うはずもない、僅かながらの報酬を探し求めてられるのは、何故だろうって。",
    "それは私にはできないこと。",
    "不合理、不条理、不理解、不寛容、不満足。",
    "溢れんばかりのそれらに潰されずにいられたのは何故なのか。",
    "ずっとじっと世界を観て、命を観て、生きるあなたたちを観続けて、ようやく分かった気がするわ。",
    "簡単なこと。",
    "当たり前のこと。",
    "ねえ、あなた、知っていた？誰も彼も笑っていた。",
    "どんな悲しみの中にさえ、一縷のひかりはそこにあった。",
    "決して忘れたわけでない。",
    "断じて放棄したわけでない。",
    "親しい誰かを亡くしても、どれだけ不幸に傷つこうとも、確かに屈さぬ心があった。",
    "どれだけ涙に塗れてたって、どの目も違わず明日をみてた。",
    "そっか。",
    "命って、こんなにも強いものなのね。",
    "悲しいことも、苦しいことも、どれも越えてゆけるなんて。",
    "あなたもきっと、そうだったのね。",
    "気が付いたとき、ようやく涙を拭えて。",
    "痛みが僅かに和らいで。",
    "光が差して、少し笑えた。",
    "そこで初めて命を識った。",
    "当然のように生きているけど。",
    "それってとても、凄いことよ。",
    "私は優しく呟いた。",
    "クルクルクルクル命は巡る。",
    "歩いた軌跡に意味はない。",
    "紡いだ模様に価値はない。",
    "それでもひたすら世界は廻る。",
    "それに続いて命は脈打つ無には帰さないを手にして。",
    "それをどこかで、わかっているから。",
    "宛てがなくとも歩いてられる。",
    "さあ！命を響かせて。",
    "すべてを抱えていられるくらい。",
    "あなたたちって凄いのよ。",
    "誇っていいわと私は謳う。",
    "遍く命を私は観てる。",
    "嗚呼、悲しいはずなのに。",
    "見離せない輝きがある。",
    "永い瞬間をつぶさに観てる。",
    "涙で視界が歪めども、ひとつたりとも逃さぬように。",
    "終わりへ立ち向かうあなたたちに、ひどく憧れる私がいた。",
    "だけど、そんなもの関係ないと。",
    "遂にその時が来てしまう。",
    "どこか嘲笑うかのように。",
    "――ああ、嘘、ああああ！そんなことって。",
    "待って、まだ。",
    "だって綺麗なの。",
    "こんなにも頑張っているの。",
    "まだ続いているものがあるの。",
    "こんな、こんな……！今も生きているものが、こんなにも多く在るというのに。",
    "世界の方が、終わるなんて。",
    "そんなの酷過ぎるわ。",
    "あんまりじゃない。",
    "命より、何より。",
    "世界が先に幕を閉じる。",
    "土台が先に駄目になる。",
    "ピシリとが入るでもなく、グチャリと潰れるのでもなく。",
    "まだ生きているものを伴って、すべてが薄く淡くなる。",
    "私が引いた線から始まるものは、世界と相成り、そして終わる。",
    "まだ先がある、命ごと。",
    "余りの無力に立ち尽くす。",
    "ひたすら涙を流すだけ。",
    "僅かな猶予も流れゆく。",
    "今まで保ってきたものが、一挙に崩れそうになる。",
    "怖い。",
    "その悲しみは耐えられそうにない。",
    "喪うのは怖いこと。",
    "私はそれを知っている。",
    "彼が刻んだ命の終わりは、今も変わらず痛みと残る。",
    "全ての命はここで潰える。",
    "後には何も残りはしない。",
    "事実を受け入れることができない。",
    "力は抜けて、ただ茫然としてるだけ。",
    "このままで良いはずないと分かっているのに。",
    "動けない。",
    "何をすればいいか、みつけられない。",
    "そんなとき、ふと。",
    "視界の端にピアノが映る。",
    "誰かが私を呼んでいる。",
    "さあ、弾いてみてよと。",
    "そんな無邪気。",
    "記憶。",
    "金色の髪を思い出す。",
    "体が思考に先んじた。",
    "私は導かれるままに、ピアノの前に腰を下ろす。",
    "指はだらりと下を向くまま。",
    "長くそれを拒んでいた。",
    "始めることに怯えていた。",
    "もし、私が弾いたとして。",
    "その終わりに私は耐えられる？自信が無い。",
    "もし、耐えられなかったなら。",
    "私はそのとき、メヌエットを好きでなくなる。",
    "それが一番、恐ろしいこと。",
    "何より忌避すべきこと。",
    "でも、終わりゆく世界を観ているだけで、何もできずにいるなんて。",
    "それだけは我慢ならなくて。",
    "指にいくらか、意識が灯る。",
    "あんなに懸命だった命は、無慈悲にここで終わりを迎える。",
    "何も知らないまま、何の咎もないというのに。",
    "当然の未来を奪われる。",
    "摂理に攫われていってしまう。",
    "なら、それを知っている私だけは。",
    "輝きも怖さも悲しさも、その終わりだって。",
    "すべてを観てきた私だけは。",
    "私にだけは、できることがある。",
    "逃げてはいけない理由がある。",
    "それが誰に知られることも無い、霞のようなものだとしても。",
    "何もしないのは、有り得ない。",
    "ねえ、そうでしょう？恐れる心も、震える指も、無理にだって動かしてやる。",
    "拭いきれずに涙は伝う。",
    "それがどうしたと私は強がる。",
    "命はみんなそうしてきた。",
    "それを私は誰より観てきた。",
    "そうだ。",
    "私にだってできるはずだ。",
    "まがりなりにも命を識った。",
    "痛みを知った、私なら。",
    "触れたのは慣れ親しんだピアノの表面。",
    "白は五十二、黒は三十六。",
    "ひやり冷たい平面は、吸い込むように指を迎える。",
    "幸い迷うことはない。",
    "選ぶ曲など、たったひとつしかありはしない。",
    "私がメヌエットと呼ぶこの曲は、既に元の曲とは別物だ。",
    "原型は丸ごと最初の数分、他は全部後付けだ。",
    "先延ばしの手段だったけど、今ではこれこそメヌエット。",
    "随分長くなったものの、選んだ音に後悔はない。",
    "ただの、ひとつも。",
    "。",
    "編んだ音色は私と同義。",
    "ここにすべてが詰まっている。",
    "これまで私が観てきたもの、聞いてきたもの、触れてきたもの、考えたこと、感じたこと、知ったこと。",
    "私のすべてはここにある。",
    "想いをそのまま受け継いでいる。",
    "大切な日々を、憶えている。",
    "だから。",
    "ふうと小さく一息吐いた。",
    "やるべきことは決まっている。",
    "それを行う覚悟もできた。",
    "残された時間は多くない。",
    "けれど、十分、弾ききれる。",
    "恐れなんて、些末なこと。",
    "「――最後、には」",
    "声は掠れる。",
    "それは私の言葉ではなく。",
    "「とびきりのものを、弾かなくちゃ」",
    "いつかに聞いた、だったけれど。",
    "今では余さず、その真意だって分かっている。",
    "音色にだって想いは宿る。",
    "ならばと私は鍵盤を弾く。",
    "ここで始まりここで終える。",
    "メヌエットを弾いて終おうか。",
    "すべてが朧に消えるとも、それが手向けになるのなら。",
    "何より先に涙が落ちる。",
    "次々伝って濡れていく。",
    "拭うことはできないけれど。",
    "沁み込んだそれで、音が美しくなればと願う。",
    "悲しみだって、涙だって。",
    "全部全部、吹き飛ばしてよメヌエット。",
    "終わりを彩る音になるくらい。",
    "――演奏。",
    "白と黒とを指が這う。",
    "それはいっそ美しく、小さな舞踏に見紛うほどに。",
    "動き流れて連なって、私は音に世界を託す。",
    "奏でる音はいつもと同じ。",
    "ずっと弾いてるメヌエット。",
    "これしか弾けないままでよかった。",
    "お揃いのままで、いたかったから。",
    "懸念の鈍りは杞憂と消えた。",
    "指は寸分も誤らず、衰えなんてありはしない。",
    "あんなに弾くのも聞くのも怖かったのに、指を舞わせてしまえば怖くなくなるのだから、不思議。",
    "これより終わるは命の。",
    "メヌエットと名付けた世界。",
    "私が始めたものなのだから、終わりを看取る責任がある。",
    "でも、今。",
    "私が指を動かせているのは。",
    "責任のためでは決してない。",
    "義務で恐れは払えない。",
    "終わりはひどく怖いもの。",
    "痛みは私に訴える。",
    "言えなかったこと、気付けなかったこと。",
    "取りこぼしはあまりに多く、後悔なんて数えきれない。",
    "だけど、それでも。",
    "一番大事なことだけは、きっと済ませたはずだから。",
    "その後悔だって、抱えてられる。",
    "だってそうだ。",
    "私が悲しみに溺れなかったのは、ひとつの記憶がどうしても、俯かせてくれなかったから。",
    "その記憶とは、つまり表情。",
    "私が一瞬この目で捉えた、終わりを迎えたあなたの表情。",
    "どうしてという疑問があった。",
    "何故その表情なのかという。",
    "最初は信じられなくて、見間違いだと何度も思った。",
    "それで心の底に沈めていた。",
    "でも、それから世界を観ているうちに、なんとなくだけど分かった気がした。",
    "あれは見間違いではなかったと。",
    "一番大事なことだけは、確かに果たせていたのだと。",
    "最期の最期に教えてくれた。",
    "つまるところ、私が終わりにピアノを弾くのは。",
    "あのときふたりで弾いたピアノが、何より綺麗で、楽しくて。",
    "あなたの最期の表情が、どうしようもない笑顔だったから。",
    "終わりゆく世界にだって、同じことができるのならと。",
    "ただそれだけで、今このに、私はピアノを弾けている。",
    "滑らかに、朗らかに、響き渡りしその音色。",
    "しかして誰にも聞こえていない。",
    "世界は知らず、いつもの通り。",
    "それを空虚と思わない。",
    "これは贈り物というよりも、独りよがりの想いのカタチ。",
    "命が生きた報酬は、きっと自分で見つけられる。",
    "それは与えるものではないはずだから。",
    "つまりはお礼みたいなもの。",
    "世界に向けた感謝の気持ち。",
    "生きててくれてありがとう。",
    "教えてくれてありがとう。",
    "美しいものをありがとう。",
    "それだけの気持ち。",
    "最後になってしまったのは、ちょっと遅かったかもしれないけれど。",
    "これは私の持ちうるすべてだから、お礼というには相応しい。",
    "ああ、けれど、もしかすると。",
    "ちょうど子守歌かもしれないわ。",
    "私、ちゃんと憶えてるのよ。",
    "あなたが眠るその前に、練習がてら弾いていたのを。",
    "子守歌じみた演奏は、ただ曲の先をどうするか、それを試してただけのこと。",
    "でもあなたが満足そうに、良い表情で眠るものだから。",
    "私も段々嬉しくなって、楽しく弾いていたんだっけ。",
    "なんだか、すべてが懐かしい。",
    "色んなことがあったもの。",
    "あらゆるものを虚仮にしたとき。",
    "ピアノに初めて触れたとき。",
    "命の脆さに呆れていたとき。",
    "あなたに初めて会ったとき。",
    "命を楽しく観てたとき。",
    "終わりを初めて知ったとき。",
    "ずっと涙を流していたとき。",
    "命をやっと理解したとき。",
    "すべては遠く彼方の軌跡。",
    "まぶたの裏に宿るもの。",
    "何度も浸ってって、それでも全く擦り切れない。",
    "思い出って、褪せないものね。",
    "ついさっきのことみたい。",
    "どんな時間も、その情景も、記憶にちゃんと刻まれている。",
    "それがお願いだったから。",
    "でも今になって考えてみたら、あなた、惜しいことをしたのかも。",
    "お願いなんてされなくたって、私、きっと憶えていたわ。",
    "あんなに楽しかったんだもの、忘れるはずがないじゃない。",
    "でも、そんなことも承知の上で、憶えておいて欲しかったのなら。",
    "それならとても、嬉しいわ。",
    "ちょっと照れくさくなっちゃうくらい。",
    "思い出が語り掛けてくる。",
    "次々浮かんで消えていく。",
    "ひとつ残らず忘れない。",
    "どれも細やかな色彩で、どれも鮮やかな感触だった。",
    "そのすべてが愛おしい。",
    "さあ！もうすぐラストスパート。",
    "ありったけを込めるとしましょう。",
    "響き渡ってよメヌエット。",
    "例え聞こえていなくても、誰もの心に残るくらいに。",
    "命ってなんだろう。",
    "その答えを私は得ている。",
    "命とは涙するもの、それを飲み込んで進むもの。",
    "誰かと共に過ごすために、時にはくだらない嘘を吐く。",
    "何かのために生きている。",
    "見つけるために生きている。",
    "何か大切なもののために、どんな恐れも振り払って、手を伸ばすことができるもので。",
    "手にしたそれがいつか零れて、後に残らぬものだとしても、美しいと、そう信じてる。",
    "ちっぽけだけど、弱くないもの。",
    "涙を越えて強くなるもの。",
    "あれ、だったら。",
    "もしかして、わたしって――ひとつ、気が付いたことがあって。",
    "わたしは緩く微笑んだ。",
    "それは、思い上がりかもしれないけれど。",
    "そうであったらいいなぁと、そんな願いを心に刻む。",
    "お揃いって、嬉しいものね。",
    "わたしはぽそりと呟いた。",
    "身体は熱い。",
    "胸が脈打つ。",
    "思い込みでは、きっとないはず。",
    "そういえば、前から思ってたことがあるの。",
    "これは絶対有り得ない、そんな『もしも』の話だけれど。",
    "言葉にするのは恥ずかしい。",
    "でも、せっかくだし言っちゃうわ。",
    "もしも、終わりに先があるのなら。",
    "そんな希望があるとするなら。",
    "また、どこかで会いましょう。",
    "できれば今度は、あなたの方から迎えに来てね。",
    "いつまでだって待っているから。",
    "わたしの名前をきっと呼んでね。",
    "そんないつかを夢に見る。",
    "手の届かない空想を、胸に秘めて信じている。",
    "賢くないけど、これは幸せ。",
    "信じることも悪くはないわ。",
    "だって、それがわたしたち。",
    "だものね。",
    "音色はもうすぐピリオドへ至る。",
    "終わりはそこに迫っている。",
    "わたしはそれを見据えてられる。",
    "ふうん。",
    "なんでか不思議と怖くないものね。",
    "あなたもきっと、こうだったのね。",
    "うん。",
    "なんだか満足よ。",
    "この思い出を、抱えてるから。",
    "いつかすべては終わるけど。",
    "そこに意味はないけれど。",
    "それでも確かに美しい。",
    "大事なものは手のひらに。",
    "創ったものは指先に。",
    "仄かな熱は胸の。",
    "わたしは私を憶えてる。",
    "それだけあれば、怖くはないわ。",
    "あ、そうそう忘れてた。",
    "これは言葉にしておかなくちゃ。",
    "溢れんばかりに伝えたいこと。",
    "「みんなみんな、大好きよ。",
    "わたし、ずっと観てたんだもの！」",
    "終わりにはやはり笑顔が似合う。",
    "これも教えてもらったこと。",
    "どうしようもなく、涙はあるけど。",
    "それでこその命と識った。",
    "「だったらさ。",
    "君にとっての大事なものも、ちゃんと見つけられたかい？」",
    "――――。",
    "音が聞こえる。",
    "音が聞こえた。",
    "当然なのに何かがおかしい。",
    "わたしが弾いてるはずなのに、そうだという確信が無い。",
    "無意識に、無自覚に。",
    "体は動いてピアノを弾く。",
    "意識は別を向いている。",
    "どこからだろう。",
    "音が聞こえた。",
    "どうしてだろう。",
    "声に聞こえた。",
    "なんだかよくわからないけど、どこか夢を見ているみたい。",
    "だからか少し、言葉を零す。",
    "誰かひとりに聞こえるくらい。",
    "「もちろんよ。",
    "たくさんあって溢れるくらい、多くのものを見つけたわ」",
    "あなたのおかげよ、ありがとう。",
    "あぶくの想いは胸ではじける。",
    "ひどく小さな、幻でした。",
    "長い演奏はようやく果てる。",
    "察して指は、惜しみまじりに鍵を沈める。",
    "いつまでも続くものはない。",
    "けれど、それは決して悪いことじゃない。",
    "始まらないと終わらぬように。",
    "終わらなければ始まりはない。",
    "気付けばこんなに当然のこと。",
    "もっと早くに気付くんだった。",
    "でも、そうね。",
    "弾き終えるのが怖かったのは、この曲が本当の本当に、一番大事なものだったから。",
    "なら、まあ、悪くはないわ。",
    "それじゃあね、メヌエット。",
    "人差し指で別れを鳴らす。",
    "――なぁんだ。",
    "ばかみたい。",
    "たった一度、曲が終わったところで、好きでなくなるはずなかったのにね？そうして遂に指は止まる。",
    "残滓に揺れる余韻は僅か。",
    "静まるようにピアノは黙る。",
    "でも、そこでは終わらせない。",
    "もうひとつだけ付け足して、それを最後にしておこう。",
    "それくらいの猶予はあるわ。",
    "労うようにピアノを撫でた。",
    "楽しかったわ、ありがとう。",
    "やっぱりピアノは最高ね。",
    "まあ、わたしが創った曲だし、当然と言えば当然だけど。",
    "でも、どうだろう。",
    "わたしが弾いたこの音色、ちゃんと届いていたかしら。",
    "聞こえるはずはないけど、それでもって思っちゃうのは、ちょっと未練がましいかもしれないわね。",
    "でも少しくらい許して欲しいわ。",
    "だってすっごく頑張ったんだもの。",
    "一番は譲れないけれど、二番目には良い演奏だったはず。",
    "失敗なんてどこにもない、完璧なピアノだったでしょう？それも全部、あなたたちに向けたものだから、光栄に思ってもいいのよ。",
    "なんて。",
    "それもやっぱり、聞こえてないか。",
    "大袈裟ぶって、恭しく。",
    "いつか見たように頭を下げる。",
    "もったいぶって口を開く。",
    "思いがけずに涙が落ちた。",
    "ここは静寂。",
    "醒める夢。",
    "走馬灯すら背を向け去った。",
    "やおら、瞳を閉じるのみ。",
    "怖いとも、悲しいとも、もうあんまり感じない。",
    "心はとても凪いでいる。",
    "やれることはすべてやったと、誇りに似た自負がある。",
    "ああ、でも。",
    "やっぱり。",
    "うん。",
    "寂しいのだけは、誤魔化せないなぁ。",
    "涙はやっぱり止まらなかった。",
    "「これにて、メヌエットは終わりです。",
    "ご清聴、ありがとうございました」",
    "それが最期。",
    "世界は終わり。",
    "此処にはひとつピアノがあるだけ。",
    "命になった、わたしの物語。",
    "「命を編んでよメヌエットすべてを愛して終えるくらい」"]
];
/*
      for(var j = 0; j < 6 && i+1<output.length; j++) {
      i++;
      textarea.append("[" + count / 500 + "] " + output[i] + "<br>");
    }
  

*/


