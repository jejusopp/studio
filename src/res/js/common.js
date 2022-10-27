"use strict";

const webUI = (function() {
    let timeout;
    return {
        getChildIndex: function(child) {
            let parent = child.parentNode;
            let children = parent.children;
            let i = children.length - 1;
            for (; i >= 0; i--) {
                if (child == children[i]) {
                    break;
                }
            }
            return i;
        },
        debounce: function(func, wait, immediate) {
            let context = this,
                args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            }, wait);
            if (immediate && !timeout) func.apply(context, args);
        },
        easeInOutQuad: function(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return (c / 2) * t * t + b;
            t--;
            return (-c / 2) * (t * (t - 2) - 1) + b;
        },
        animatedScrollTo: function(element, to, duration) {
            let start = element.scrollLeft;
            let change = to - start;
            let currentTime = 0;
            let increment = 20;
            let animateScroll = function(callback) {
                currentTime += increment;
                let val = Math.floor(
                    webUI.easeInOutQuad(currentTime, start, change, duration)
                );
                element.scrollLeft = val;
                if (currentTime < duration) {
                    window.requestAnimationFrame(animateScroll);
                } else {
                    if (callback && typeof callback === "function") {
                        callback();
                    }
                }
            };
            animateScroll();
        },
        addListener: function(node, event, listener, useCapture) {
            if (!node || !event || !listener) return;

            if (node instanceof Node) {
                node.addEventListener(
                    event,
                    listener,
                    typeof useCapture === "undefined" ? false : useCapture
                );
            } else if (node instanceof NodeList) {
                if (node.length > 0) {
                    for (let i = 0, l = node.length; i < l; i++) {
                        node[i].addEventListener(
                            event,
                            listener,
                            typeof useCapture === "undefined" ? false : useCapture
                        );
                    }
                }
            }
        },
        addDelegate: function(node, event, selector, listener, useCapture) {
            if (!node || !event || !listener) return;

            webUI.addListener(
                node,
                event,
                function(e) {
                    let target = e.target;
                    if (typeof selector === "string") {
                        while (target.matches(selector) == false && target !== this) {
                            target = target.parentElement;
                        }
                        if (target.matches(selector)) {
                            listener.call(target, e);
                        }
                    } else {
                        selector.call(this, e);
                    }
                },
                useCapture
            );
        },
    };
})();

let navUi = (function () {
    return {
        initMainNav: function (node) {
            webUI.addDelegate(node, "click", ".tab_link", function (e) {
                e.preventDefault();
                if (!this.classList.contains("current")) {
                    const indexNum = webUI.getChildIndex(this);
                    node.querySelector(".current").classList.remove("current");
                    this.classList.add("current");
                    webUI.animatedScrollTo(
                        node,
                        node.querySelectorAll("li")[indexNum].offsetLeft +
                        node.querySelectorAll("li")[indexNum].clientWidth * 0.5 -
                        node.clientWidth * 0.5,
                        300
                    );
                }
            });
            node.addEventListener('scroll', function (e) {
                if (node.scrollLeft < 10) {
                    node.parentNode.querySelector('.ic_arrow_prev').classList.remove('on')
                } else {
                    node.parentNode.querySelector('.ic_arrow_prev').classList.add('on')
                }
                if (node.scrollLeft > node.scrollWidth - node.clientWidth - 10) {
                    node.parentNode.querySelector('.ic_arrow_next').classList.remove('on')
                } else {
                    node.parentNode.querySelector('.ic_arrow_next').classList.add('on')
                }
            });
            webUI.addDelegate(node.parentNode, "click", ".ic_arrow_prev", function (e) {
                e.preventDefault();
                webUI.animatedScrollTo(
                    node,
                    node.scrollLeft  - 400,
                    300
                );
            });
            webUI.addDelegate(node.parentNode, "click", ".ic_arrow_next", function (e) {
                e.preventDefault();
                webUI.animatedScrollTo(
                    node,
                    node.scrollLeft  + 400,
                    300
                );
            });

        }
    };
})();



const floatUI = (function () {
    let pTop;
    let before_st;
    return {
        init: function (prevTop) {
            before_st = 0;
            if (prevTop !== undefined) {
                pTop = prevTop.offsetHeight;
            } else {
                pTop = 0;
            }
            let last_st = 0;
            let ticking = false;
            window.addEventListener("scroll", function (e) {
                last_st = window.scrollY;
                if (!ticking) {
                    window.requestAnimationFrame(function () {
                        floatUI.onScroll(last_st);
                        ticking = false;
                    });
                    ticking = true;
                }
            });
            window.addEventListener("resize", function (e) {
                if (prevTop !== undefined) {
                    pTop = prevTop.offsetHeight;
                } else {
                    pTop = 0;
                }
                floatUI.onScroll(last_st);
            });
        },
        onScroll: function (st) {
            const ela = document.querySelectorAll(".fix");
            const scoEla = document.querySelectorAll('.sco_block');
            const list_wrapper = document.querySelector('.list_wrap');
            if (ela.length) {
                ela.forEach(function (el) {
                    if (pTop > el.getBoundingClientRect().top) {
                        el.children[0].style.position = "fixed";
                        el.children[0].style.top = pTop + "px";
                        el.children[0].style.left = "0px";
                        el.children[0].style.right = "0px";
                        el.children[0].style.zIndex = "10";
                    } else {
                        el.children[0].style.position = "";
                        el.children[0].style.top = "";
                        el.children[0].style.left = "";
                        el.children[0].style.right = "";
                        el.children[0].style.zIndex = "";
                    }
                    before_st = st;
                });
            }
            if (scoEla != null && list_wrapper != null) {
                scoEla.forEach(function (el) {
                    const sco = list_wrapper.getBoundingClientRect().top;
                    const height = el.offsetHeight;
                    const scoTop = el.getBoundingClientRect().top;
                    const opacityVal = 1 - (sco - scoTop) / height;
                    const rgbaCol = 'rgba(13,15,26, ' + opacityVal + ')'
                    el.style.backgroundColor = rgbaCol;
                    if (opacityVal > '1') {
                        el.style.backgroundColor = 'rgba(13,15,26,1)';
                    } else if (opacityVal < '0') {
                        el.style.backgroundColor = 'rgba(13,15,26,0)';
                    }
                });
            }
        }
    };
})();

const focusUI = (function () {
    return {
        doFocus: function (e) {
           // e.preventDefault();
            if (!e.currentTarget) return;
            let str = e.currentTarget.dataset.focus;
            let arr = str.split("-");
            let newStr;
            if(e.keyCode == 37){
                console.log("좌")
                arr[1] = parseInt(arr[1]) - 1;
                newStr = arr[0] + "-" + arr[1];
                if (document.querySelector(`[data-focus="${newStr}"]`)) {
                    document.querySelector(`[data-focus="${newStr}"]`).focus();
                    document.querySelector(`[data-focus="${str}"]`).classList.remove('active');
                    document.querySelector(`[data-focus="${newStr}"]`).classList.add('active');
                    console.log(newStr);
                } else {
                    arr[0] = 1;
                    arr[1] = parseInt(arr[1]) + 1;
                    newStr = arr[0] + "-" + arr[1];
                    console.log(newStr);
                    if (document.querySelector(`[data-focus="${newStr}"]`)) {
                        document.querySelector(`[data-focus="${newStr}"]`).focus();
                        document.querySelector(`[data-focus="${str}"]`).classList.remove('active');
                        document.querySelector(`[data-focus="${newStr}"]`).classList.add('active');
                    } else {
                        return;
                    }
                }
            }else if(e.keyCode == 38){
                console.log("상")
                arr[0] = parseInt(arr[0]) - 1;
                arr[1] = 1;
                newStr = arr[0] + "-" + arr[1];
                if (document.querySelector(`[data-focus="${newStr}"]`)) {
                    document.querySelector(`[data-focus="${newStr}"]`).focus();
                    document.querySelector(`[data-focus="${str}"]`).classList.remove('active');
                    document.querySelector(`[data-focus="${newStr}"]`).classList.add('active');
                } else {
                    return;
                }
            } else if(e.keyCode == 39){
                console.log("우")
                arr[1] = parseInt(arr[1]) + 1;
                newStr = arr[0] + "-" + arr[1];
                if (document.querySelector(`[data-focus="${newStr}"]`)) {
                    document.querySelector(`[data-focus="${newStr}"]`).focus();
                    document.querySelector(`[data-focus="${str}"]`).classList.remove('active');
                    document.querySelector(`[data-focus="${newStr}"]`).classList.add('active');
                } else {
                    arr[0] = parseInt(arr[0]) + 1;
                    arr[1] = 1;
                    newStr = arr[0] + "-" + arr[1];
                    if (document.querySelector(`[data-focus="${newStr}"]`)) {
                        document.querySelector(`[data-focus="${newStr}"]`).focus();
                        document.querySelector(`[data-focus="${str}"]`).classList.remove('active');
                        document.querySelector(`[data-focus="${newStr}"]`).classList.add('active');
                    } else {
                        return;
                    }
                }
            }else if(e.keyCode == 40){
                console.log("하")
                arr[0] = parseInt(arr[0]) + 1;
                arr[1] = 1;
                newStr = arr[0] + "-" + arr[1];
                if (document.querySelector(`[data-focus="${newStr}"]`)) {
                    document.querySelector(`[data-focus="${newStr}"]`).focus();
                    document.querySelector(`[data-focus="${str}"]`).classList.remove('active');
                    document.querySelector(`[data-focus="${newStr}"]`).classList.add('active');
                } else {
                    return;
                }
            }

        }
    };
})();








/* 레이어 팝업 */
const layerPopup = (function() {
    let html = undefined;
    let layer;
    let sctop;
    return {
        show: function(elem, container) {
            layer = document.querySelector(elem);
            if (container == null) {
                html =
                    document.body.scrollTop == "0" ?
                        document.documentElement :
                        document.body;
            } else {
                html = container;
            }
            sctop = html.scrollTop;
            html.style.top = 0 - sctop + "px";
            html.classList.add("noscroll");
            if (layer !== null) {
                layer.style.display = "block";
                document.body.setAttribute("data-popup", "true");
                setTimeout(function() {
                    layer.classList.add("visible");
                }, 50);
            }
        },
        hide: function(elem, effect = "") {
            if (html == undefined) {
                html =
                    document.body.scrollTop == "0" ?
                        document.documentElement :
                        document.body;
            }
            if (elem !== undefined) {
                layer = document.querySelector(elem);
            }
            html.classList.remove("noscroll");
            html.scrollTop = sctop;
            html.style.top = "";
            if (layer !== null) {
                setTimeout(() => {
                    document.body.setAttribute("data-popup", "false");
                }, 500);
                layer.classList.remove("visible");
                if (effect == "fast") {
                    layer.style.display = "none";
                } else {
                    setTimeout(function() {
                        if (layer !== null) {
                            layer.style.display = "none";
                        }
                    }, 500);
                }
            }
        },
    };
})();

export {webUI, navUi, floatUI, layerPopup, focusUI}