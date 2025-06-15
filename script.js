window.scrollTo(1000, 1000); // 사이트 열면 해당 좌표에서 시작

// 플레이어 위치 설정 (키보드 누르면 이 좌표로 이동함)
window.onload = () => {
    box.style.left = '2200px';
    box.style.top = '1330px';
}



// 할머니 이동 ========================================

window.addEventListener('keydown', function (e) {
    const keys = ['w', 's', 'a', 'd'];
    if (keys.includes(e.key)) {
        e.preventDefault(); // 스크롤 방지
    }
});

let box = document.querySelector('.box')
let map = document.getElementById('map')
let step = 10

document.addEventListener('keydown', (e) => {
    // 만약 실행이 안된다면 순서를 바꿔보기
    let currentLeft = parseInt(box.style.left) || 0;
    let currentTop = parseInt(box.style.top) || 0;

    let canMove = true
    let currentDirection = 'down'

    if (e.key === 'a') {
        currentDirection = 'left'
        if (currentLeft - step >= 0) {
            box.style.left = currentLeft - step + 'px'
        } else {
            canMove = false
        }


    } else if (e.key === 'd') {
        currentDirection = 'right'
        if (currentLeft + step + box.offsetWidth <= map.offsetWidth /*맵의 크기*/ ) {
            box.style.left = currentLeft + step + 'px'
        } else {
            canMove = false
        }


    } else if (e.key === 'w') {
        currentDirection = 'up'
        if (currentTop - step >= 200) {
            box.style.top = currentTop - step + 'px'
        } else {
            canMove = false
        }


    } else if (e.key === 's') {
        currentDirection = 'down'
        if (currentTop + step + box.offsetHeight <= map.offsetHeight) {
            box.style.top = currentTop + step + 'px'
        } else {
            canMove = false
        }
    }

    box.dataset.direction = currentDirection
    box.dataset.walking = true // 키보드를 누르고 있으면 true, 떼고 있으면 false



// 카메라 이동 =========================================

    if (canMove) {
        centerCameraOnPlayer(); // 플레이어가 이동 했을 때 시점도 같이 이동
    }

})

function centerCameraOnPlayer() {
    const box = document.querySelector('.box');
    const boxRect = box.getBoundingClientRect();

    const absoluteX = window.scrollX + boxRect.left + boxRect.width / 2;
    const absoluteY = window.scrollY + boxRect.top + boxRect.height / 2;

    window.scrollTo({
        top: absoluteY - window.innerHeight / 2,
        left: absoluteX - window.innerWidth / 2,
        behavior: 'smooth' // 카메라 이동이 뚝뚝 끊기는 걸 방지
    });
}



// 대화창 ===============================

const dialogueBox = document.getElementById('dialogue');
const dialogueText = dialogueBox.querySelector('.dialogue-text');
const dialogueName = dialogueBox.querySelector('.dialogue-name');
const listUI = document.getElementById('list');

// 오프닝 대화창 대사
const dialogues = [
    ["노인", "( 나는 요양원에서 지내고 있다. )"],
    ["노인", "( 여기서는 매일 같은 하루가 반복되고... )"],
    ["노인", "( 나는 지금 학대를 당하고 있다. )"],
    ["요양사", "빨리 식사 끝내세요! 다른 분들도 기다리고 있어요."],
    ["노인", "( 말도 잘 안 나오고, 누구에게 말할 수도 없다. )"],
    ["노인", "( 딸래미가 오늘 온다고 했었던 것 같은데... )"],
    ["노인", "( 학대 사실을 말하기엔.. 누가 내 말을 들어주기나 할까? )"],
];

let dialogueIndex = 0;

// 대사 출력
function showDialogue() {
    const [name, line] = dialogues[dialogueIndex];
    dialogueName.innerText = name;
    dialogueText.innerText = line;
}

showDialogue();

// 대화창 클릭 시 다음 대사 나옴
// 엔딩, 오프닝 같이 묶음
dialogueBox.addEventListener('click', () => {
    if (isEnding) {
        endingIndex++; // 엔딩
        if (endingIndex < endingLines.length) {
            const [name, line] = endingLines[endingIndex];
            dialogueName.innerText = name;
            dialogueText.innerText = line;
        } else {
            dialogueBox.style.display = 'none';
            showGameOver();
        }
    } else {
        dialogueIndex++; // 오프닝
        if (dialogueIndex < dialogues.length) {
            showDialogue();
        } else {
            dialogueBox.style.display = 'none';
            listUI.style.display = 'flex'; // 오프닝 대화창이 사라지면 리스트 등장

            startTimer(); // 오프닝 대화창이 사라지면 타이머 시작
        }
    }
});




// 오브젝트 찾기 ============================================

document.addEventListener('keyup', () => {
    box.dataset.walking = false
})

let sparkleObjs = document.querySelectorAll('.sparkle');
let listIcons = document.querySelectorAll('#list img[data-id]');
let number = document.querySelector('.number');
let count = 0; // 전역변수
let totalItems = listIcons.length; // 리스트 개수 기준

const itemInfo = {
    1: {
        img: 'img/찢어진종이.png',
        text: '규정집의 찢어진 부분 같다.\n* 입소보증금을 받는 건 금지되어 있음. *'
    },
    2: {
        img: 'img/출근부.png',
        text: '출근부야.\n이 날 이 간병인은 없었던 것 같은데...\n조작인걸까?'
    },
    3: {
        img: 'img/규정집.png',
        text: '찢긴 규정집. 왜 찢어 놓은 걸까?'
    },
    4: {
        img: 'img/썩은과일.png',
        text: '과일이 썩어 있어...먹을 것도 별로 없고.'
    },
    5: {
        img: 'img/약.png',
        text: '약은 시간을 잘 지켜 섭취하라고 적혀있는데...\n난 오늘도 받지 못했어.'
    }
};

const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-image');
const modalText = document.getElementById('modal-text');
const modalClose = document.getElementById('modal-close');


// 반짝이 클릭하면 아이템 나오는 거
sparkleObjs.forEach(obj => {
    obj.addEventListener('click', () => {
        const id = obj.dataset.id;

        obj.style.display = 'none';

        count++;
        number.innerText = `${count} / ${totalItems}`;

        listIcons.forEach(icon => {
            if (icon.dataset.id === id) {
                icon.classList.add('find');
            }
        });

        // 모달창 열기
        const info = itemInfo[id];
        if (info) {
            modalImg.src = info.img;
            modalText.innerText = info.text;
            modal.style.display = 'flex';
        }
    });
});

modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});


// 타이머
let timeLimit = 60;

function startTimer() {
    const timerArea = document.querySelector('.time');
    timerArea.style.display = 'block';
    timerArea.innerText = `면회 오기 전 까지 : ${timeLimit}초`; // 초기 출력

    let timer = setInterval(() => {
        if (timeLimit > 0) {
            timeLimit--;
            timerArea.innerText = `면회 오기 전 까지 : ${timeLimit}초`; // 계속 갱신
        } else {
            clearInterval(timer);
            startEnding();
        }
    }, 1000);
}


// 엔딩 대화창
// 오프닝과 엔딩을 나누기 위함
let isEnding = false;
let endingIndex = 0;
let endingLines = [];

const endingDialogues = {
    success: [
        ["노인", "( 아무리 그래도... 이건 아닌 것 같아... 너무 힘들어. )"],
        ["딸", "엄마! 많이 기다렸지? 미안해, 요즘 일이 너무 바빠서..."],
        ["노인", "( ..... 힘들어도 내색하면 안 돼... )"],
        ["딸", "왜 이렇게 말이 없어...? 무슨 일 있어 엄마?"],
        ["노인", "아니야... 괜찮아... "],
        ["딸", "무슨 일 인데? 다 말해봐."],
        ["노인", "사실은... 여긴... 여긴 사람이 살 데가 아니야..."],
        ["노인", "밥도 제대로 안 나오고, 약도 제대로 안 주고,\n저번엔 멍까지 들었는데... 언제 생겼는지는 모르겠어..."],
        ["딸", "뭐...? 이게 다 무슨 소리야?"],
        ["노인", "내가 증거도 다 모아놨어... 규정집, 약 봉투, 다..."],
        ["요양원장", "오해십니다. 어르신들께서 가끔... 기억이 혼란스러우실 때가 있어서요."],
        ["요양원장", "모든 직원들은 교육을 수료했고, 식재료들은 모두 검수를 거칩니다.\n약도 저희가 꾸준히 잘 챙겨드리고 있고요."],
        ["요양원장", "아무래도 어르신께서 기억을 잘 못하시는 것 같습니다."],
        ["딸", "... 엄마, 정말이야?"],
        ["노인", "( ......... )"],
        ["", "누군가는 침묵했고, 누군가는 외면했고, 누군가는 이익을 선택했다."],
        ["", "Ending 1"],
    ],
    fail: [
        ["노인", "( 오늘은 말해야 되는데... 아직 증거가 부족해... )"],
        ["딸", "엄마! 많이 기다렸지? 미안해, 요즘 일이 너무 바빠서..."],
        ["노인", "( 괜히 말해봤자, 딸만 더 걱정시킬 뿐이고...\n아무도 내 말을 안 믿어 줄 거야... )"],
        ["딸", "여기 과일 좀 사왔어. 저번에 이거 먹고 싶다 그랬잖아."],
        ["노인", "고마워... 고마워 우리 딸."],
        ["딸", "요즘 어때? 잘 지내는 거 맞지?"],
        ["노인", "응... 잘 지내. 좋은 사람들도 많고."],
        ["노인", "( 아니야... 좋은 사람 없어...\n하지만 너도 바쁠거고, 걱정시키긴 싫어... )"],
        ["딸", "다행이네!! 다음에 또 올게 엄마. 혹시 필요한 거 있으면 말하고!"],
        ["노인", "( ..... )"],
        ["", "그날 밤, 또 욕설을 들었다."],
        ["", "밥 대신 차갑게 식어버린 죽이 나왔다."],
        ["", "그녀는 평생을 자식을 위해 살아왔고,\n마지막까지도 자식을 위해 침묵했다."],
        ["", "Ending2"],
    ]
};

function startEnding() {
    // 배경, 리스트, 시간 등등 다 숨기고 엔딩 이미지만 뜨게
    document.getElementById('list').style.display = 'none';
    document.querySelector('.time').style.display = 'none';
    document.getElementById('map').style.display = 'none';
    document.getElementById('npc2').style.display = 'none';

    // 엔딩 이미지
    const endingImage = document.createElement('img');
    endingImage.src = 'img/엔딩.png';
    endingImage.id = 'ending-img';
    endingImage.classList.add('ending-img');
    document.body.appendChild(endingImage);

    // 상태 전환
    isEnding = true;
    endingIndex = 0;
    endingLines = (count === totalItems) ? endingDialogues.success : endingDialogues.fail;
    // 찾은 아이템 = 총 아이템 개수 라면 성공엔딩 출력하고 아니면 실패엔딩 출력

    // 대사 출력
    const [name, line] = endingLines[endingIndex];
    dialogueName.innerText = name;
    dialogueText.innerText = line;
    dialogueBox.style.display = 'flex';
    dialogueBox.style.zIndex = '999';
}


