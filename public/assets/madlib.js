function formatMadlib(a) {
    for (; a.match(blankRe); )
        a = a.replace(blankRe, '<span class="blank"><input type="text" class="blank-input" autocomplete="off" /><span class="blank-pos">$1</span></span>');
    return a
}
var blankRe = /{([^{}]+)}/;
