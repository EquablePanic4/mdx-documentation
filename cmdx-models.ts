class CmdxDefinition {
    type : CmdxType;
    pattern : string;
    match : string;
    css : string;

    constructor(_type : string, _pattern : string, _match : string, _css : string) {
        this.type = CmdxType[_type];
        this.pattern = _pattern;
        this.match = _match;
        this.css = _css;
    }

    parseUsingDefinition(line : string) {
        let ocpArr = this.pattern.split('...');
        if (ocpArr.length == 2) {
            if (ocpArr[0] == ocpArr[1]) {
                //Mamy patterny <tag>...</tag>
                return `<${ocpArr[0]} ${this.css != null ? 'class="' + this.css + '" ' : ""}>${line}</${ocpArr[1]}>`;
            }
        }

        else {
            if (ocpArr.length == 3) {
                //Mamy pattern ul...li...ul
                return "";
            }

            else {
                //Chodzi o pattern <znacznik attr1 attr2 ... />
                //Kolejność zapisu [1](2){3}
                let objectResolved = new OrderedCmdx(this, line);
                return objectResolved.getHtml(this.css);
            }
        }
    }

    getAttribResolver() : Array<AttribResolver> {
        let tempArr = new Array<AttribResolver>();
        let splitted = this.pattern.split(" ");
        for (let i = 1; i < splitted.length; i++)
            tempArr.push(new AttribResolver(splitted[i]));

        //Teraz sortujemy
        let orderedArr = new Array<AttribResolver>(tempArr.length);
        for (let i = 0; i < tempArr.length; i++)
            orderedArr[tempArr[i].index] = tempArr[i];

        return orderedArr;
    }

    getSingleTagMarkup() : string {
        let arr = this.pattern.split(" ");
        return arr[0];
    }
}

//Do rozwiązywania atrybutów z XMLa
class AttribResolver {
    index : number;
    name : string;

    constructor(tagAttrPattern : string) {
        this.name = "";
        for (let i = 0; i < tagAttrPattern.length; i++) {
            //Dodajemy do name po kolei znaki, do póki nie natkniemy się na {}
            if (tagAttrPattern.charAt(i) != "{")
                this.name += tagAttrPattern.charAt(i);
            else
                break;
        }

        //Teraz sprawdzamy na którym miejscu to ma być
        for (let i = this.name.length; i < tagAttrPattern.length; i++) {
            //Teraz wyjmujemy cyfrę którą napotkamy jako pierwszą
            if (tagAttrPattern.charCodeAt(i) >= 48 && tagAttrPattern.charCodeAt(i) <= 57) {
                this.index = parseInt(tagAttrPattern.charAt(i));
                break;
            }
        }
        
        //Jeżeli coś poszło nie tak, to mamy błąd w pliku xml, zostawiamy
    }

    getAttribute(val : string) {
        return `${this.name}="${val}"`;
    }
}

//Do rozwiązywania atrybótów z pliku cmdx
class OrderedCmdxResolver {
    //Kolejność zapisu [1](2){3}
    ordered : Array<string>;

    constructor(cmdxPattern : string) {
        //Szukamy dwóch takich samych znaczników
        let arr = new Array<DictionaryObject>();
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

                //Dodajemy to co mamy do listy
                arr.push(new DictionaryObject(cmdxCloseDirectives.indexOf(cmdxPattern.charAt(i)), cacheVal));
            }

            //Dzięki takiemu rozwiązaniu możemy stosować nawet takie zapisy:
            //[param1] (param2) {param3}
            //(param2) {param3} [param1]
            i++;
        }

        //Mamy przygotowaną tablicę, z wartościami po kolei
        this.ordered = new Array<string>(arr.length);
        for (let j = 0; j < arr.length; j++)
            this.ordered[arr[j].index] = arr[j].prop;
    }
}

//Łączy ze sobą atrybuty z xml z wartościami z cmdx
class OrderedCmdx {
    attribs : Array<string>;
    markup : string;

    constructor(cmdxDefinition : CmdxDefinition, cmdxDirective : string) {
        //Tworzymy tablicę attrResolver
        let attrRes = cmdxDefinition.getAttribResolver();
        let dirvRes = new OrderedCmdxResolver(cmdxDirective); //ordered
        this.markup = cmdxDefinition.pattern.split(' ')[0];

        this.attribs = new Array<string>();
        for (let i = 0; i < attrRes.length && i < dirvRes.ordered.length; i++)
            this.attribs.push(attrRes[i].getAttribute(dirvRes.ordered[i]));
    }

    getHtml(css : string) : string {
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
    index : number;
    prop : string;

    constructor (_index : number, _prop : string) {
        this.index = _index;
        this.prop = _prop;
    }
}

enum CmdxType {
    preline,
    inline
}