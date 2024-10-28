<script>
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Send, Pencil, Code } from "lucide-svelte";
    export let platforms;
</script>

<section class="w-full py-12 md:py-24 lg:py-32 xl:py-48">
    <div class="container px-4 md:px-6">
        <div
            class="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]"
        >
            <div class="flex flex-col justify-center space-y-4">
                <div class="space-y-2">
                    <h1
                        class="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                    >
                        Write Once, Publish Everywhere
                    </h1>
                    <p class="max-w-[600px] text-muted-foreground md:text-xl">
                        Create, edit, and publish your articles to multiple
                        platforms with ease. Streamline your content creation
                        process with our powerful online editor.
                    </p>
                </div>
                <div class="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button size="lg" href={route("app.articles.index")}>
                        Get Started
                    </Button>
                    <!--
                    <Button size="lg" variant="outline">Learn More</Button>
                    -->
                </div>
            </div>
        </div>
    </div>
</section>
<section
    id="features"
    class="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
>
    <div class="container px-4 md:px-6">
        <h2
            class="text-3xl font-bold tracking-tighter md:text-4xl mb-8 text-center"
        >
            Key Features
        </h2>
        <div class="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
            <Card.Root>
                <Card.Header>
                    <Pencil class="h-8 w-8 mb-2" />
                    <Card.Title>Powerful Editor</Card.Title>
                </Card.Header>
                <Card.Content>
                    <p>
                        Rich text editing with markdown support and real-time
                        preview.
                    </p>
                </Card.Content>
            </Card.Root>
            <Card.Root>
                <Card.Header>
                    <Send class="h-8 w-8 mb-2" />
                    <Card.Title>Multi-Platform Publishing</Card.Title>
                </Card.Header>
                <Card.Content>
                    <p>
                        Publish your content to multiple platforms with a single
                        click.
                    </p>
                </Card.Content>
            </Card.Root>
            <Card.Root>
                <Card.Header>
                    <Code class="h-8 w-8 mb-2" />
                    <Card.Title>Robust API</Card.Title>
                </Card.Header>
                <Card.Content>
                    <p>
                        Integrate our editor into your workflow with our
                        comprehensive API.
                    </p>
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</section>
<section id="platforms" class="w-full py-12 md:py-24 lg:py-32">
    <div class="container px-4 md:px-6">
        <h2
            class="text-3xl font-bold tracking-tighter md:text-4xl mb-8 text-center"
        >
            Supported Platforms
        </h2>
        <div
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-center"
        >
            {#each platforms as platform}
                <div class="flex flex-col items-center justify-center">
                    <div
                        class="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4"
                    >
                        <span class="text-2xl font-bold uppercase"
                            >{platform.name[0]}</span
                        >
                    </div>
                    <span class="text-sm font-medium">{platform.name}</span>
                </div>
            {/each}
        </div>
    </div>
</section>
