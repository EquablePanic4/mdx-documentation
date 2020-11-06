class CmdxDefinition {
    constructor(_type, _pattern, _match, _css) {
        this.type = CmdxType[_type];
        this.pattern = _pattern;
        this.match = _match;
        this.css = _css;
    }
    parseUsingDefinition(line) {
        let ocpArr = this.pattern.split('...');
        if (ocpArr.length == 2) {
            if (ocpArr[0] == ocpArr[1]) {
                return `<${ocpArr[0]} ${this.css != null ? 'class="' + this.css + '" ' : ""}>${line}</${ocpArr[1]}>`;
            }
        }
        else {
            if (ocpArr.length == 3) {
                return "";
            }
            else {
                let objectResolved = new OrderedCmdx(this, line);
                return objectResolved.getHtml(this.css);
            }
        }
    }
    getAttribResolver() {
        let tempArr = new Array();
        let splitted = this.pattern.split(" ");
        for (let i = 1; i < splitted.length; i++)
            tempArr.push(new AttribResolver(splitted[i]));
        let orderedArr = new Array(tempArr.length);
        for (let i = 0; i < tempArr.length; i++)
            orderedArr[tempArr[i].index] = tempArr[i];
        return orderedArr;
    }
    getSingleTagMarkup() {
        let arr = this.pattern.split(" ");
        return arr[0];
    }
}
class AttribResolver {
    constructor(tagAttrPattern) {
        this.name = "";
        for (let i = 0; i < tagAttrPattern.length; i++) {
            if (tagAttrPattern.charAt(i) != "{")
                this.name += tagAttrPattern.charAt(i);
            else
                break;
        }
        for (let i = this.name.length; i < tagAttrPattern.length; i++) {
            if (tagAttrPattern.charCodeAt(i) >= 48 && tagAttrPattern.charCodeAt(i) <= 57) {
                this.index = parseInt(tagAttrPattern.charAt(i));
                break;
            }
        }
    }
    getAttribute(val) {
        return `${this.name}="${val}"`;
    }
}
class OrderedCmdxResolver {
    constructor(cmdxPattern) {
        let arr = new Array();
        const cmdxOpenDirectives = "[({";
        const cmdxCloseDirectives = "])}";
        let i = 0;
        while (i < cmdxPattern.length) {
            if (cmdxOpenDirectives.includes(cmdxPattern.charAt(i))) {
                i++;
                let cacheVal = "";
                while (!cmdxCloseDirectives.includes(cmdxPattern.charAt(i))) {
                    cacheVal += cmdxPattern.charAt(i);
                    i++;
                }
                arr.push(new DictionaryObject(cmdxCloseDirectives.indexOf(cmdxPattern.charAt(i)), cacheVal));
            }
            i++;
        }
        this.ordered = new Array(arr.length);
        for (let j = 0; j < arr.length; j++)
            this.ordered[arr[j].index] = arr[j].prop;
    }
}
class OrderedCmdx {
    constructor(cmdxDefinition, cmdxDirective) {
        let attrRes = cmdxDefinition.getAttribResolver();
        let dirvRes = new OrderedCmdxResolver(cmdxDirective);
        this.markup = cmdxDefinition.pattern.split(' ')[0];
        this.attribs = new Array();
        for (let i = 0; i < attrRes.length && i < dirvRes.ordered.length; i++)
            this.attribs.push(attrRes[i].getAttribute(dirvRes.ordered[i]));
    }
    getHtml(css) {
        let html = `<${this.markup} `;
        if (css != null)
            html += `class="${css}" `;
        for (let i = 0; i < this.attribs.length; i++) {
            html += `${this.attribs[i]} `;
        }
        html += "/>";
        return html;
    }
}
class DictionaryObject {
    constructor(_index, _prop) {
        this.index = _index;
        this.prop = _prop;
    }
}
var CmdxType;
(function (CmdxType) {
    CmdxType[CmdxType["preline"] = 0] = "preline";
    CmdxType[CmdxType["inline"] = 1] = "inline";
})(CmdxType || (CmdxType = {}));
//# sourceMappingURL=cmdx-models.js.map