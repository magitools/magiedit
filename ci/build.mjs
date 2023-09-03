import {connect} from "@dagger.io/dagger"

connect(async (client) => {
    const node = await client.container().from("node:18-alpine").withDirectory("/app", client.host().directory("."), {
        exclude: ["node_modules"]
    })

    const runner = node.withWorkdir("/app").withExec(["npm", "install"])
    const out = await runner.withEnvVariable("NODE_BUILD", "y").withExec(["npm", "run", "build"]).stderr()
}, {LogOutput: process.stdout})