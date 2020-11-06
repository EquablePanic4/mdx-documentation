class CmdxDefinition {
    constructor(_type, _pattern, _match, _css) {
        this.type = CmdxType[_type];
        this.pattern = new CmdxPattern(_pattern);
        this.match = _match;
        this.css = _css;
    }
    parseUsingDefinition(line) {
        return this.pattern.getStringElement(line, this.css);
    }
}
class CmdxPattern {
    constructor(_pattern) {
        this.pattern = _pattern;
    }
    getStringElement(content, css) {
        let ocpArr = this.pattern.split('...');
        if (ocpArr.length == 2) {
            if (ocpArr[0] == ocpArr[1]) {
                return `<${ocpArr[0]} ${css != null ? 'class="' + css + '" ' : ""}>${content}</${ocpArr[1]}>`;
            }
        }
        else {
        }
    }
}
var CmdxType;
(function (CmdxType) {
    CmdxType[CmdxType["preline"] = 0] = "preline";
    CmdxType[CmdxType["inline"] = 1] = "inline";
})(CmdxType || (CmdxType = {}));
//# sourceMappingURL=cmdx-models.js.map