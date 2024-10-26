<div class="w-full h-full relative space-y-6" x-data="editor" @content-save.window="saveArticle"  @initial-done.window="loading = false">
    <div>
        <flux:card>
            <div>
                <flux:heading>Warning: this editor is a Work In Progress!</flux:heading>
                <flux:subheading>You may encounter bugs; don't hesitate to signal them! :) </flux:subheading>
            </div>
        </flux:card>
    </div>
    <div>
        <flux:button id="saveButton" >Save</flux:button>
    </div>
    <flux:accordion transition>
        <flux:accordion.item>
            <flux:accordion.heading>Frontmatter Settings</flux:accordion.heading>

            <flux:accordion.content>
                <flux:table>
                    <flux:columns>
                        <flux:column>Key</flux:column>
                        <flux:column>Value</flux:column>
                    </flux:columns>
                    <flux:rows>
                        <template x-for="(row, index) in rows" x-bind:key="index">
                            <flux:row>
                                <flux:cell>
                                    <flux:input x-model="row.key" />
                                </flux:cell>
                                <flux:cell>
                                    <flux:input x-model="row.value" />
                                </flux:cell>
                                <flux:cell>
                                    <flux:button @click="deleteRow(index)">Delete</flux:button>
                                </flux:cell>
                            </flux:row>
                        </template>
                    </flux:rows>
                </flux:table>
                <flux:button class="w-full" @click="addRow">+</flux:button>
            </flux:accordion.content>
        </flux:accordion.item>
    </flux:accordion>
    <div class="w-full">
        <div id="bubble-menu">
            <div class="flex">
                <button id="bm-bold">Bold</button>
                <button id="bm-italic">Italic</button>
                <button id="bm-strike">Strike</button>
            </div>
        </div>
        <flux:card id="editor" class="max-h-full" data-content="{{$this->content}}">
        </flux:card>
    </div>
</div>

@script
<script>
    // inspired by filament's key-value form component
    Alpine.data('editor', () => {
        return {
            shouldUpdateRows: true,
            rows: [],
            fm: $wire.fm,

            init: function() {
              this.updateRows()
                if (this.rows.length <= 0) {
                    this.rows.push({ key: '', value: '' })
                } else {
                    this.updateState()
                }
            },

            saveArticle: function() {
                this.updateState()
                $wire.save(document.querySelector('#editor').getAttribute('data-content'), Alpine.raw(this.fm))
            },

            addRow: function () {
                this.rows.push({ key: '', value: '' })

                this.updateState()
            },

            deleteRow: function (index) {
                this.rows.splice(index, 1)

                if (this.rows.length <= 0) {
                    this.addRow()
                }

                this.updateState()
            },

            updateRows: function () {
                if (!this.shouldUpdateRows) {
                    this.shouldUpdateRows = true

                    return
                }

                let rows = []

                for (let [key, value] of Object.entries(this.fm ?? {})) {
                    rows.push({
                        key,
                        value,
                    })
                }
                this.rows = rows
            },

            updateState: function() {
                let state = {}
                this.rows.forEach((row) => {
                    if (row.key === '' || row.key === null) {
                        return
                    }

                    state[row.key] = row.value
                })
                this.shouldUpdateRows = false
                this.fm = state
            }
        }
    })
</script>
@endscript
@vite("resources/js/editor.js")
