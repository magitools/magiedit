import './bootstrap';
import { Livewire, Alpine } from '../../vendor/livewire/livewire/dist/livewire.esm';

// Register any Alpine directives, components, or plugins here...
Alpine.directive('clipboard', (el) => {
    let text = el.textContent

    el.addEventListener('click', () => {
        console.log("copying")
        navigator.clipboard.writeText(text)
    })
})

Livewire.start()
