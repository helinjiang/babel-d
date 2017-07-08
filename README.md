# babel-d

在 node 端使用 babel 运行编译某个文件夹下所有js文件到某个指定文件夹。

## 背景

在使用 [babel](https://babeljs.io) 来 [Compile Directories](https://babeljs.io/docs/usage/cli/#babel-compile-directories) 时，可以使用 `--out-dir` 或者 `-d` 参数。

例如，我们要编译 `src` 文件夹下所有的js文件，并输出到 `lib` 文件夹下，则可以执行：

```bash
babel src --out-dir lib

# 或者

babel src -d lib
```

这是通过 `babel-cli` 来运行的。如果需要在 node 端调用编译某个文件，可以安装 `babel-core`，并使用其提供的 `babel.transform` 等 [api](https://babeljs.io/docs/core-packages/)。但是这种方式如果处理某个文件夹下所有的文件的编译，则十分不方便，因此本项目就是为了解决这种场景。

## 参考

- https://github.com/babel/babelify