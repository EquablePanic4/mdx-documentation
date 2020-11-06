var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var definitions;
window.addEventListener('load', function () {
    return __awaiter(this, void 0, void 0, function* () {
        definitions = new Array();
        yield loadXmlDefinitions("cmdx-interop-translations.xml");
        yield cmdxInitializer();
    });
});
const cmdxInitializer = () => {
    let arr = document.getElementsByClassName('cmdx-display');
    for (let i = 0; i < arr.length; i++) {
        loadCmdx(arr[i]);
    }
};
const loadCmdx = (elem) => {
    fetch(elem.getAttribute('cmdx-source'))
        .then(response => response.text()).then(data => {
        let elements = generateCmdxStringComponentArray(data);
        elem.innerHTML = elements.join("");
    });
};
const generateCmdxStringComponent = (line) => {
    if (line) {
        let arr = line.split(' ');
        let cmdxDef = definitions.filter(e => e.match == arr[0])[0];
        if (cmdxDef != null && cmdxDef != undefined) {
            return cmdxDef.parseUsingDefinition(arrNoSelectorString(arr));
        }
        else {
            if (!isStringEmpty(line)) {
                cmdxDef = definitions.filter(e => e.match == "all")[0];
                return cmdxDef.parseUsingDefinition(line);
            }
        }
    }
};
const loadXmlDefinitions = (location) => __awaiter(this, void 0, void 0, function* () {
    let parser = new DOMParser();
    yield fetch(location).then(response => response.text()).then(e => {
        let xml = parser.parseFromString(e, "text/xml");
        let arr = xml.getElementsByTagName("cmdx");
        for (let i = 0; i < arr.length; i++) {
            definitions.push(new CmdxDefinition(arr[i].getAttribute("type"), arr[i].getAttribute("pattern"), arr[i].getAttribute("match"), arr[i].getAttribute("css")));
        }
    });
});
const generateCmdxStringComponentArray = (cmdxText) => {
    let arr = cmdxText.split('\n');
    let arrStrComponents = new Array();
    for (let i = 0; i < arr.length; i++)
        arrStrComponents.push(generateCmdxStringComponent(arr[i]));
    return arrStrComponents;
};
const arrNoSelectorString = (arr) => {
    let str = "";
    for (let i = 1; i < arr.length; i++) {
        str += arr[i];
        if (i < (arr.length - 1))
            str += " ";
    }
    return str;
};
const isStringEmpty = (str) => {
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 32)
            return false;
    }
    return true;
};
//# sourceMappingURL=cmdx-interop.js.map