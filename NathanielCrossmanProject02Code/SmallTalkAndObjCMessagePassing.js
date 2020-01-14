/**
 * Brief introduction:
 * Since the beginning of this class, I decided to use a different language for every project. 
 * Primarily, to sharpen my skills in those languages and to help me think more outside of the box.
 * For this project I decided that I would use JavaScript with Node.js as the framework.
 * Additionally, In order to understand what message passing was I read up on how Smalltalk and Objective-C implemented it.
 * My "version" of message passing is more based on Objective-C than Smalltalk, and in all honesty, I'm not 100% sure this is what you want.
 * 
 * Crucial Design Principle: 
 * Every message belonging to a given object must have a unique identifier.
 * Since I chose the message name to be the unique identifier, no receiver is allowed to have the same message name.
 * This is to say Message overloading  is not allowed. 
 * It's worth noteing that I tried to implement this behavior but i could not figure out the elegant solution.
 * What I tried was to hash the message name and each parameters types. For example, A method called DoSomething + int and string all got hash together.
 * This worked, but required the Sender to provide the type of all parameters when requesting a message. 
 * I didn't like this and scratch the whole idea. You never specified that messaging overloading is required so I'm not implementing it.
 * Hope that's okay?
 * In summation, message passing in my system does not suport OverLoaded Messages!
 * 
 * How could serialization be implemented in our project
 * 
 */

/**
 * 
 * Use an O(1) lookup data structure to associate messages with methods of responding to messages.
 * From what I've researched about the collections dict the get function  is O(1)
 */
var Dict = require("collections/dict");

/**
 * This method was used to prevent naming collisions for overloaded method. 
 * For example, we could have a message from the same receiver that has the same name but different parameters
 * This is not used as I am not any more implementing method overloading
 * 
 */
String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return ""+hash;
  };

/**
 * This class Implement a mechanism for encapsulating messages including receiver, argument values, and return values.
 */
function StoreMyMessages() {
    this.functions = new Dict;
    this.addFunctions = function(passedObject, message, params) {
        var tempFunc = passedObject[message];
        if (!passedObject || !message || typeof (message) !== 'string') {
            var str = "Error: ".concat(message);
            return  str.concat(" is not defined");
        }
    
        if (passedObject === null || typeof (passedObject) !== 'object') {
            var str = "Error: ".concat(passedObject.prototype.name);
            return  str.concat(" is not defined");
        }
        /**
         * Why don't we recursively check to see if a Class, Object, Or function
         * Inheritance or knows about another message. 
         * Maybe the calling method is embedded in one of these
         */
        if (typeof (tempFunc) === 'undefined' && typeof (passedObject['forwardToNextObect']) !== 'undefined') {
            console.log("Not Found in passed object called (" + passedObject.name + ") But the Object has a Forwarding address\n -" + 
            "We will recursively search next object for " +message);
            this.addFunctions(passedObject.forwardToNextObect(), message, params);
        }else if (typeof (tempFunc) === 'function') {
            if(typeof (params) !== 'undefined'){
                this.functions.set(message, [tempFunc, params]);
            }else{ 
                this.functions.set(message, [tempFunc]);
            }
            console.log("Receivers (" + passedObject.name + ") message (" + message + ") was successfully saved!\n");
           
                
        }
    };

    /**
     * This is not used as I am not any more supporting Messaging overloading.
     * 
     */
    this.createKey = function( message ,params){
        var str = "";
        var tempParams= "";
        //There are 1 or more params
        if(typeof (params) !== 'undefined'){
            if(Array.isArray(params)){
                for(i = 0; i < params.length; ++i){
                    tempParams = tempParams +  typeof(params[i]);
                }   
            }else{
                //Only one item
                tempParams = typeof(params);
            }
            str = message + tempParams;
           
        }else{
            str = message;
        }
        return str.hashCode()
    };
    /**
     * Since I am no longer supporting messaging overloading I do not need to worry about the parameters.
     * In order to execute a message or send that message one only needs to give me the Message name and receiver
     */
    this.executeTheMessage = function(message) {
        var tempFuncAndpram = this.functions.get(message); // Should always return an array even if there is no parameters
        var response = null;
        
        if(typeof (tempFuncAndpram) == 'undefined'){
            var str = "Error: The message " + message+ " is unknown";
            return  str;
        }

        if(Array.isArray(tempFuncAndpram)){
            var f = tempFuncAndpram[0];
            var pr = tempFuncAndpram[1];
            if  (typeof (f) === 'function') {
                if(typeof (pr) !== 'undefined'){
                    if(Array.isArray(pr)){
                        //Multiple parameters
                        response = f(...pr);
                    }else{
                        //Single parameter
                        response = f(pr);
                    }

                }else{
                    ///No parameter
                    response = f(); 
                }

            }else{
                var str = "Error: in " + passedObject.name + " the message is not defided " + f.name;
                return  str;
            }
        }
        return response;  
        
    };
}


/**
 * Implement a mechanism for encapsulating what object sent a message
 */
function MyMessages() {
    this.object = new Dict;
    this.addMessage = function(receiver, method, argument) {
        var messageManager = new StoreMyMessages();
        if(this.object.has(receiver.name)){
            var tempItem = this.object.get(receiver.name);
            tempItem.addFunctions(receiver, method, argument)
            this.object.set(receiver.name,tempItem);
        }else{
            messageManager.addFunctions(receiver, method, argument);
            this.object.set(receiver.name,messageManager);
        }
    };
    this.sendMessage = function(receiver, messageRequested) {
        var messageResult = null;
        if(this.object.has(receiver)){
            var tempItem = this.object.get(receiver);
            messageResult = tempItem.executeTheMessage(messageRequested);
           
        } 
        return messageResult
    };
}


function test1() {
    this.name = "test1";
    this.forwardToNextObect = function () {
        return obj2;
    };
}

function test2() {
    this.name = "test2";
    this.forwardToNextObect = function () {
        return obj3;
    };
}

function test3() {
    this.name = "test3";
    this.receivingFunction = function () {
        return "Executed receivingFunction and its Parameter Value is in test3";
    };
}

function test4() {
    this.name = "test4";
    this.doSomething = function (string, printAt) {
        var temp = " ";
        for (i = printAt; i <string.length; ++i) {
            var temp = temp  + " "+ string.charAt(i);
            console.log(temp)
        }
        return "Executed doSomething";
    };
}

//Test Objects to be sent
var obj1 = new test1();
var obj2 = new test2();
var obj3 = new test3();
var obj4 = new test4();

//Mechanisms for encapsulating and sending Messages
var mymethodObejct = new StoreMyMessages();
var messagesObject = new MyMessages()


//Test results
messagesObject.addMessage(obj4, 'doSomething', ["theName", 2]); 
messagesObject.addMessage(obj3, 'receivingFunction');
messagesObject.addMessage(obj1, 'receivingFunction', "This a test to pass a message");

console.log(messagesObject.sendMessage("test4", 'doSomething'));
console.log(messagesObject.sendMessage("test3", 'receivingFunction')); 
console.log(messagesObject.sendMessage("test1", 'receivingFunction')); // Recursively look for other objects



messagesObject.addMessage(obj4, 'doSomething', ["printMyCharAtIndex2", 1]); // Change the Parameter of the message
console.log(messagesObject.sendMessage("test4", 'doSomething'));

