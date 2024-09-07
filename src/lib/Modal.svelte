<script lang="ts">
    export let show: boolean = false;
    export let onClose: () => void = () => {};
    export let content: string = '';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(content)
        .then(() => {
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

</script>

{#if show}
    <div class="flex inset-0 fixed bg-black/50 items-center justify-center z-50" on:click={onClose}>
        <div class="flex flex-col p-10 max-w-[50%] rounded-lg text-white bg-[#2f2f2f]" on:click|stopPropagation>
            <slot></slot>
            <p class="p-2 overflow-y-scroll items-center justify-center">{content}</p>
            <div class="flex flex-row space-x-2">
              <button 
                class="p-1 rounded-lg bg-blue-500" 
                on:click="{copyToClipboard}"
              >
                Copy
              </button>
              <button
                class="p-1 rounded-lg bg-blue-500" 
                on:click="{onClose}"
              >
                Close
              </button>
            </div>
        </div>
    </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-content {
    background-color: #2f2f2f;
    color: white;
    padding: 20px;
    border-radius: 5px;
    max-width: 500px;
    width: 100%;
    z-index: 1001;
  }
</style>
