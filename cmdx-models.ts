class CmdxDefinition {
    type : CmdxType;
    pattern : CmdxPattern;
    match : string;
    css : string;

    constructor(_type : string, _pattern : string, _match : string, _css : string) {
        this.type = CmdxType[_type];
        this.pattern = new CmdxPattern(_pattern);
        this.match = _match;
        this.css = _css;
    }

    parseUsingDefinition(line : string) {
        return this.pattern.getStringElement(line, this.css);
    }
}

class CmdxPattern {
    pattern : string;

    constructor(_pattern : string) {
        this.pattern = _pattern;
    }

    getStringElement(content : string, css : string) : string {
        //Sprawdzamy czy jest to pattern <znacznik>...</znacznik>
        let ocpArr = this.pattern.split('...');
        if (ocpArr.length == 2) {
            if (ocpArr[0] == ocpArr[1]) {
                //Mamy patterny <tag>...</tag>
                return `<${ocpArr[0]} ${css != null ? 'class="' + css + '" ' : ""}>${content}</${ocpArr[1]}>`;
            }
        }

        else {
            //Mamy styczność z innym patternem
        }
    }
}

enum CmdxType {
    preline,
    inline
}