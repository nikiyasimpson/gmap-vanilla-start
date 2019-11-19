# Step04 - Deploy

[previous step](Step03.md) <----> [next step](Step05.md) | [home](../README.md)

## Initialize Firebase in the Cloud

Go to [console.firebase.google.com](console.firebase.google.com) and let's follow the steps there.

## Initialize Firebase in the Console

Now it's time to initialize Firebase and connect this project to the project we just create in the console.
The gist is -> you manage your application on Firebase console through the command line.

1. So, first thing to do is sign in:

```
firebase login
```

Now, firebase tools know who you are what your projects are. You can see them by running

```
firebase list
```

but that's not what we need.

2. We need to choose the project we want to and generate the files we need to for deployment.
   So, in your console run

```
firebase init
```

This will eventually generate the following file: `firebase.json`, `.firebaserc`. You can read more about these files in
the [documentation](https://firebase.google.com/docs/cli/#initialize_a_firebase_project).

- In the first step/question choose Hosting.

* In **Hosting Setup**:
  - in the _pubic directory_ question, be sure to specify
    the public directory to be "`docs`".
  - Configure as a single-page app --> `No`
  - And don't overwrite `index.html`

3. Now that initialization is finished, take a look at your generated files! You can read more about `firebase.json` in the [docs](https://firebase.google.com/docs/cli/#the_firebasejson_file).

4. And now, my favorite step! Just type and run

```
firebase deploy
```

And your app is live in the URL provided there!

Now. go to your [console](https://console.firebase.google.com/), in your project, at the hosting tab, and see it there!

[previous step](Step03.md) <----> [next step](Step05.md) | [home](../README.md)
