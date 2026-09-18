// ==UserScript==
// @name         MC百科每日一条龙：签到+访问主页+推荐整合包+推荐MOD+点赞服务器
// @namespace    https://github.com/mustardwheat/mcmod-daily
// @version      1.6
// @description  打开 https://center.mcmod.cn/#/task/ 后自动完成：签到 → 访问指定用户主页 → 推荐指定整合包 → 推荐指定MOD → 点赞指定服务器（SERVER_ID=1 时跳过）→ 回到自己的主页。使用前请先在脚本顶部配置区填写自己的目标 ID。
// @author       mustardwheat
// @license      MIT
// @match        https://center.mcmod.cn/*
// @match        https://www.mcmod.cn/modpack/*.html*
// @match        https://www.mcmod.cn/class/*.html*
// @match        https://play.mcmod.cn/sv*.html*
// @icon         https://www.mcmod.cn/favicon.ico
// @homepageURL  https://github.com/mustardwheat/mcmod-daily
// @supportURL   https://github.com/mustardwheat/mcmod-daily/issues
// @updateURL    https://raw.githubusercontent.com/mustardwheat/mcmod-daily/main/mcmod.user.js
// @downloadURL  https://raw.githubusercontent.com/mustardwheat/mcmod-daily/main/mcmod.user.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    /* ==================================================
     *  配置区：修改下面的数字 ID 即可指定目标
     *  其中 SERVER_ID 设为 1 表示跳过「点赞服务器」步骤
     * ================================================== */
    const TARGET_USER_ID = 1; // 要访问的用户主页  center.mcmod.cn/1/
    const MODPACK_ID     = 1; // 要推荐的整合包    www.mcmod.cn/modpack/1.html
    const MOD_ID         = 1; // 要推荐的MOD       www.mcmod.cn/class/1.html
    const SERVER_ID      = 1; // 要点赞的服务器    play.mcmod.cn/sv1.html（1 = 跳过此步）
    /* ================================================== */

    const FLOW_KEY = 'mcmod_flow_running';

    /* 最后一步：回到自己的主页（读取头像链接地址，当前页跳转，不开新标签） */
    function goMyHomepage() {
        const avatar = document.querySelector(
            'li.user-name a[href*="center.mcmod.cn"], .header-user a[href*="center.mcmod.cn"]'
        );
        if (avatar) {
            console.log('[MC百科] ✅ 全部完成，回到自己的主页');
            location.href = avatar.href;
        } else {
            console.log('[MC百科] ✅ 全部完成（未找到头像链接，停留当前页）');
        }
    }

    /* ---------- 第 1 步：任务页自动签到 ---------- */
    if (location.hostname === 'center.mcmod.cn' && location.hash.startsWith('#/task')) {
        const timer = setInterval(() => {
            const btn = document.querySelector('#task-check-in');
            if (!btn) return;
            clearInterval(timer);

            if (btn.disabled || /已签到/.test(btn.textContent)) {
                console.log('[MC百科] 今天已签到过');
                goHomepage();
            } else {
                btn.click();
                console.log('[MC百科] 签到完成 🎉');
                setTimeout(goHomepage, 2000);
            }
        }, 500);
        setTimeout(() => clearInterval(timer), 30000);

        function goHomepage() {
            sessionStorage.setItem(FLOW_KEY, '1');
            location.href = 'https://center.mcmod.cn/' + TARGET_USER_ID + '/';
        }
        return;
    }

    /* ---------- 第 2 步：用户主页 → 整合包页面 ---------- */
    if (location.hostname === 'center.mcmod.cn' && sessionStorage.getItem(FLOW_KEY) === '1') {
        sessionStorage.removeItem(FLOW_KEY);
        console.log('[MC百科] 已访问主页，2秒后前往整合包页面');
        setTimeout(() => {
            location.href = 'https://www.mcmod.cn/modpack/' + MODPACK_ID + '.html?mcmod_flow=1';
        }, 2000);
        return;
    }

    /* ---------- 第 3、4 步：推荐整合包 / 推荐MOD ---------- */
    if (location.hostname === 'www.mcmod.cn' && location.search.includes('mcmod_flow=1')) {
        const isModpack = location.pathname.startsWith('/modpack/');

        const timer = setInterval(() => {
            const li = document.querySelector('.common-fuc-group li.push');
            if (!li) return;
            clearInterval(timer);

            const text = li.querySelector('.action span').textContent.trim();
            const icon = li.querySelector('i').className;

            if (text === '推荐' && icon.includes('far')) {
                li.click();
                console.log('[MC百科] 已点推荐 👍');
            } else {
                console.log('[MC百科] 已推荐过（当前状态：' + text + '）');
            }

            if (isModpack) {
                setTimeout(() => {
                    location.href = 'https://www.mcmod.cn/class/' + MOD_ID + '.html?mcmod_flow=1';
                }, 2000);
            } else if (SERVER_ID === 1) {
                // 配置了跳过服务器点赞，直接回自己的主页
                console.log('[MC百科] SERVER_ID=1，跳过点赞服务器');
                setTimeout(goMyHomepage, 2000);
            } else {
                // 第 5 步：前往服务器页点赞
                setTimeout(() => {
                    location.href = 'https://play.mcmod.cn/sv' + SERVER_ID + '.html?mcmod_flow=1';
                }, 2000);
            }
        }, 500);
        setTimeout(() => clearInterval(timer), 30000);
    }

    /* ---------- 第 5 步：点赞服务器 → 回到自己的主页 ---------- */
    if (location.hostname === 'play.mcmod.cn' && location.search.includes('mcmod_flow=1')) {
        const timer = setInterval(() => {
            const li = document.querySelector('li.thumbup');
            if (!li) return;
            clearInterval(timer);

            const text = li.querySelector('.action span').textContent.trim();
            const icon = li.querySelector('i').className;

            if (text === '点赞' && icon.includes('far')) {
                li.click();
                console.log('[MC百科] 已给服务器点赞 👍');
            } else {
                console.log('[MC百科] 服务器已点赞过（当前状态：' + text + '）');
            }

            // 最后一步：回到自己的主页
            setTimeout(goMyHomepage, 2000);
        }, 500);
        setTimeout(() => clearInterval(timer), 30000);
    }
})();
