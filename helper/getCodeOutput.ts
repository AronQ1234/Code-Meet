// import { languageIds } from "@/helper/constants/languageIds";
// import { fetchWithoutInput } from "@/helper/fetchWithoutInput";

// function getLanguageId<T, K extends keyof T>(languageIds: T, lang: K){
//     return languageIds[lang];
// }
// 

export default async function getCodeOutput (code:string, input:string, lang:string) {
    const response = await fetch('/api/code-output', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            code,
            input,
            lang,
        }),
    });
    const data = await response.json();
    if (response.ok) {
        return data.output;
    } else {
        console.error('Error:', data.error);
    }

}


// var languageId:number;
    // languageId=getLanguageId(languageIds, lang)
    // console.log(lang, languageId)
    // try {
    //     if (!input) {
    //         const output = await fetchWithoutInput(code, input, (languageId as number))
    //         console.log(output, 'get fetch')
    //         return output;
    //     }
    //     else{

    //     }
    // } catch (error) {
        
    // }