# app-builder

[![Actions Status](https://github.com/calebboyd/app-builder/workflows/app-builder-ci/badge.svg)](https://github.com/calebboyd/app-builder/actions)

Create composable promise based middleware pipelines.

## Install:

`npm install app-builder`

## Example

```javascript
import { compose } from 'app-builder'

const app = compose([
  async function (ctx, next) {
    ctx.value += 1
    await next()
    ctx.value += 4
  },
  async function (ctx, next) {
    ctx.value += 2
    await next()
    ctx.value += 3
  }
]);

const context = { value: '' }
app(context).then(() => console.log(context.value)) // --> '1234'

```
