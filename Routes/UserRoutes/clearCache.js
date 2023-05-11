const express = require("express")
const app = express()
const cookieparser = require('cookie-parser');
app.use(cookieparser());
const middleware = require("../../Middleware/middleware")
const aboutUsModal = require("../../Modals/UserRoutes/missionModal");
const { body, validationResult, param, check } = require('express-validator');
const fs = require('fs');

app.get("/", async (request, response) => {
    //Only for About us page
    try {
        const fileNameForApply = '../client/src/Components/AdminComponents/Pages/AboutUs/aboutUsAdmin.css';
        const fileNameForUpdate = '../client/src/Components/UserComponents/about.css'

        const data = await aboutUsModal.find({}).clone().catch(err => response.status(400).send("Erro"))
        var dataArray = data[0].Modules;
        var fullString = '';
        var intialArray = [];
        var firstIndex;
        var nextIndex;

        //Variables for css Initally only
        var fullStringCss1 = "";
        var fullStringCss2 = "";
        var arrayForCss1 = [];
        var arrayForCss2 = [];
        var firstIndexCss1;
        var nextIndexCss1;
        var firstIndexCss2;
        var nextIndexCss2;

        // Creating a full string
        for (let i = 0; i < dataArray.length; i++) {
            fullString = fullString + dataArray[i].data;
        }
        //Creating Array recursively
        function createArrayActive(string) {
            if (firstIndex === -1) return intialArray
            firstIndex = string.indexOf('class="');
            if (firstIndex !== -1) {
                nextIndex = string.indexOf('"', firstIndex + 7);
                intialArray.push(string.slice(firstIndex + 7, nextIndex))
                return createArrayActive(string.slice(nextIndex + 2, string.length))
            }
            else return intialArray
        }
        createArrayActive(fullString)

        //find the classes in the present Apply for admin panel css files
        fs.readFile(fileNameForApply, 'utf8', (err, data) => {
            if (err) throw err;
            fullStringCss1 = fullStringCss1 + data
            function createArrayCSS1(string) {
                if (firstIndexCss1 === -1) return arrayForCss1
                firstIndexCss1 = string.indexOf('.')
                if (firstIndexCss1 !== -1) {
                    nextIndexCss1 = string.indexOf('{', firstIndexCss1 + 1)
                    arrayForCss1.push(string.slice(firstIndexCss1 + 1, nextIndexCss1))
                    return createArrayCSS1(string.slice(nextIndexCss1 + 1, string.length))
                }
                else return arrayForCss1
            }
            createArrayCSS1(fullStringCss1)
        })

        //find the classes in the present Apply for admin panel css files
        fs.readFile(fileNameForUpdate, 'utf8', (err, data) => {
            if (err) throw err;
            fullStringCss2 = fullStringCss2 + data
            function createArrayCSS2(string) {
                if (firstIndexCss2 === -1) return arrayForCss2
                firstIndexCss2 = string.indexOf('.')
                if (firstIndexCss2 !== -1) {
                    nextIndexCss2 = string.indexOf('{', firstIndexCss2 + 1)
                    arrayForCss2.push(string.slice(firstIndexCss2 + 1, nextIndexCss2))
                    return createArrayCSS2(string.slice(nextIndexCss2 + 1, string.length))
                }
                else return arrayForCss2
            }
            createArrayCSS2(fullStringCss2)
            // filter out the active from the remaining css 
            const activeItemsCss1 = intialArray.filter((num) => arrayForCss1.includes(num))
            const activeItemsCss2 = intialArray.filter((num) => arrayForCss2.includes(num))
            // find the content of the active class and the overtie the file for active class (because the pattern is not fixed for adding class---> DEveloper,Random generator )
            // 1) find the content from CSS1 i.e
            var checkArray = ["pYvqQLJuIa", "rinnYrPMvt"]
            var finalArrayCss1 = [];
            var firstIndexContext
            var nextIndexContext
            var substringContext

            function createArray1(string) {
                for (let i = 0; i < activeItemsCss1.length; i++) {
                    //we need content of i class
                    function helper(string) {
                        if (firstIndexContext === -1) return
                        firstIndexContext = string.indexOf(`.${activeItemsCss1[i]}`)
                        if (firstIndexContext !== -1) {
                            nextIndexContext = string.indexOf('}', firstIndexContext)
                            substringContext = string.slice(firstIndexContext, nextIndexContext + 1)
                            finalArrayCss1.push(substringContext)
                            substringContext = 0;
                            return helper(string.slice(nextIndexContext, string.length))
                        }
                        else  return 
                    }
                    helper(string)
                    firstIndexContext = 0;
                    nextIndexContext = 0;
                    substringContext = 0
                }
                return finalArrayCss1
            }
            createArray1(fullStringCss1)
            //Similarly for second CSS2
            var finalArrayCss2 = [];
            var firstIndexContext2
            var nextIndexContext2
            var substringContext2

            function createArray2(string) {
                for (let i = 0; i < activeItemsCss2.length; i++) {
                    //we need content of i class
                    function helper(string) {
                        if (firstIndexContext2 === -1) return
                        firstIndexContext2 = string.indexOf(`.${activeItemsCss2[i]}`)
                        if (firstIndexContext2 !== -1) {
                            nextIndexContext2 = string.indexOf('}', firstIndexContext2)
                            substringContext2 = string.slice(firstIndexContext2, nextIndexContext2 + 1)
                            finalArrayCss2.push(substringContext2)
                            substringContext2 = 0;
                            return helper(string.slice(nextIndexContext2, string.length))
                        }
                        else  return 
                    }
                    helper(string)
                    firstIndexContext2 = 0;
                    nextIndexContext2 = 0;
                    substringContext2 = 0
                }
                return finalArrayCss2
            }
            createArray2(fullStringCss2)
            //Finally make a string and past in the that particular files
            let finalData = finalArrayCss1.join("  ")
            fs.writeFile(fileNameForApply, finalData, 'utf8', (err) => {
                if (err) throw err;
              });
            let finalData2 =finalArrayCss2.join("  ")
            fs.writeFile(fileNameForUpdate, finalData2, 'utf8', (err) => {
                if (err) throw err;
              });
            return response.status(200).send({ intialArray, arrayForCss1, arrayForCss2, activeItemsCss1, activeItemsCss2,finalArrayCss1,finalArrayCss1,finalArrayCss2})
        })
    }
    catch (err) {
        return response.status(400).send(err)
    }
})
module.exports = app;