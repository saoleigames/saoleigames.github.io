// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-05-31
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==
(function() {

    'use strict';

    const QS = name => document.querySelector(name);
    //检测是否有分集
    const muti_page = QS('#multi_page');
        //没有就不必要运行插件
    if (!muti_page) {
        console.log('脚本信息：未检测到分集！')
        return;
    }

    function main(jump) {

        const jump_time = convertTimeToSeconds(jump);
        //获取当前在播（通常第一个）选集的长度
        const play = QS(".list-box li.on");
        let play_d = play.querySelector('.duration').innerText;
        play_d = convertTimeToSeconds(play_d);
        //计算末尾长度
        const end_d = play_d - jump_time;
        console.log("脚本信息|末尾长度: " + end_d);
        //第一次跳转以输入
        let real_jump = jump_time;

        const video = document.querySelector('video');

        video.addEventListener('timeupdate', () => {
            // 如果当前时间超过跳转时间点
            if (video.currentTime >= real_jump) {
                //获取当前在播项目
                const play = QS(".list-box li.on");
                //获取下一个选集的长度
                const next = play.nextElementSibling;
                let next_d = next.querySelector('.duration').innerText;
                next_d = convertTimeToSeconds(next_d);
                //更新下一次跳转的时间
                real_jump = next_d - end_d;
                console.log('脚本跳转: ' + next_d);
                // 尝试跳转到下一集
                const nextButton = document.querySelector('.bpx-player-ctrl-next');
                if (nextButton) {
                    nextButton.click();
                } else {
                    // 如果没有下一集按钮，重新播放当前集
                    video.currentTime = 0;
                    video.play();
                }
            }
        });
    }

    function convertTimeToSeconds(timeStr) {
        const timeParts = timeStr.split(/[:：]/);
        let hours = 0, minutes = 0, seconds = 0;
        if (timeParts.length === 2) {
            minutes = parseInt(timeParts[0], 10);
            seconds = parseInt(timeParts[1], 10);
        } else if (timeParts.length === 3) {
            hours = parseInt(timeParts[0], 10);
            minutes = parseInt(timeParts[1], 10);
            seconds = parseInt(timeParts[2], 10);
        } else {
            throw new Error("时间格式不正确，请使用 'HH:MM' 或 'HH:MM:SS' 格式。");
        }
        return hours * 3600 + minutes * 60 + seconds;
    }

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.width = '300px';
    container.style.padding = '20px';
    container.style.backgroundColor = 'white';
    container.style.border = '1px solid #ccc';
    container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    container.style.zIndex = '9999';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '14px';
    document.body.appendChild(container);

    // 创建输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.style.width = '100%';
    input.style.marginBottom = '10px';
    input.style.padding = '5px';
    input.placeholder = '格式 分:秒，例如10:12';
    container.appendChild(input);

    // 创建执行按钮
    const executeButton = document.createElement('button');
    executeButton.innerText = '执行';
    executeButton.style.marginRight = '10px';
    executeButton.style.padding = '5px 10px';
    executeButton.style.cursor = 'pointer';
    executeButton.onclick = function() {
        const inputValue = input.value;
        if (inputValue) {
            main(inputValue);
            document.body.removeChild(container);
        }
    };
    container.appendChild(executeButton);

    // 创建取消按钮
    const cancelButton = document.createElement('button');
    cancelButton.innerText = '取消';
    cancelButton.style.padding = '5px 10px';
    cancelButton.style.cursor = 'pointer';
    cancelButton.onclick = function() {
        document.body.removeChild(container);
    };
    container.appendChild(cancelButton);
})();

