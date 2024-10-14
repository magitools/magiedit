import { basicSetup } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';

document.addEventListener('DOMContentLoaded', () => {
    Livewire.on('load', () => {
        Alpine.data('editor', () => {
   	       const codeMirror = []

       return {
            'content' : $wire.entangle('content')
        }
    }
)
    })
})
