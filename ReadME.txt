Consider serialization of parameters and return values. You do not need to implement serialization but describe how it could be implemented.
There are really two approaches to consider when thinking about how to serialize parameters and return types in our message passing system. 
One way would be to utilize the built-in capacity in JavaScript (JSON.stringify) to convert all types to JSON or 
I would implement my own variant on the serialization design pattern. Implementing my own serialization design pattern would be pointless, 
but if I had to implement it myself, I would base my implementation off these two articles:
• http://www.ocoudert.com/blog/2011/07/09/a-practical-guide-to-c-serialization/
• http://www.onegeek.com.au/projects/javascript-serialization
Explain how your approach may be extended to enable distributed message passing. 
You must address how the asynchronous nature of distributed messaging may be handled using your approach.
I originally was going to suggest we use queues to provide a locking mechanism and thereby, allow for asynchronous message passing. 
For example, I could potentially use facets of GCD to help model this approach. 
However, this approach does not inherently fix our thread safety issues and does not necessarily make our message passing asynchronous. 
Moreover, introducing an intrinsic lock mechanism for my mutable message passing system using a serial queue would be a headache in my opinion. 
Therefore, I propose to implement the Actor Model. 
From what I’ve researched it seems extremely easy to modify my simplistic message passing system to incorporate this paradigm. 
Here are a couple articles that I read on the topic:
• https://doc.akka.io/docs/akka/current/guide/actors-intro.html : About Actors
• https://tonyg.github.io/squeak-actors/ : Actors for Squeak Smalltalk