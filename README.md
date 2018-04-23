# image-upload

Hi there, sorry for the delay. Only had chance to do it today.

So we should assume some limitiations in this solution. First of all because of time I can spent (~4-5 hrs) and reality of such solutions.
To create a trully cool file manager app, we should spend at least few weeaks. It includes UI, UX, product, QA and many other inputs. Limitinations in this solution:
 - Do not have pretty UI/UX
 - Do not have prod ready tests
 - Written in vanila js
 - Doesn't scale
 - Doesn't do replics
 
 
# tests

I've not written tests :( To write tests for this solution I'd use jest with snapshot testing and I'd test every function. As you've may noticed I wrote pretty good composoble code, with a lot of functions and each of that can be tested.
In the peretty common way:

```
this.updateTotal(total)
expect(this.$total.innerHTML).to.eql(total)
```

To test async stuff I'd use fake server to mock API.


# How to run?

- Clone repo
- run `npm install`
- run `sails lift`
- go to `localhost:1337`
