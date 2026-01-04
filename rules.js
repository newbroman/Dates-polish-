const grammarRules = {
    genitive: {
        title: "The Genitive Case (Dopełniacz)",
        explanation: "In Polish, when saying a date, we don't say 'May 4'. We say 'The 4th of May'.",
        rule: "Months ending in 'eń' change to 'nia' (Styczeń -> Stycznia). Months ending in 'y' or 'ec' change to 'ego' (Luty -> Lutego, Marzec -> Marca)."
    },
    years: {
        title: "Saying Years",
        explanation: "Years in Polish are treated like long ordinal numbers.",
        example: "2024 is 'dwutysięczny dwudziesty czwarty' (two-thousandth twentieth fourth)."
    }
};
export default grammarRules;
