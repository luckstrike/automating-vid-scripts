<script lang="ts">
    // Importing the Svelte components
    import Brainstorm from './modes/Brainstorm.svelte';
    import Script from './modes/script/Script.svelte';
    import Summarize from './modes/Summarize.svelte';

    // Creating the elements for the sidebar
    let links = [
        {name: 'Home', color: '#FFD700', anchor: 'none', isActive: true},
        {name: 'Brainstorm', color: '#990000', anchor: 'brainstorm', isActive: true},
        {name: 'Script', color: '#107500', anchor: 'script', isActive: false},
        {name: 'Summarize', color: '#003d75', anchor: 'summarize', isActive: false},
    ];

    function activateLink(index: number) {
        links = links.map((link, i) => ({
            ...link,
            isActive: i === index
        }));
    }
</script>

<div class="flex-container">
    <div class="sidenav">
        <!-- Creating the sidebar elements with Svelte -->
        <!-- Use link.anchors here -->
        {#each links as link, index}
        <a 
            href=""
            data-index={index} 
            style="--after-color: {link.color};"
            class:active={link.isActive}
            on:click|preventDefault={() => activateLink(index)}>
            {link.name}
        </a>
    {/each}
    </div>

    <div class="content">
        {#if links[1].isActive}
            <Brainstorm />
        {:else if links[2].isActive}
            <Script />
        {:else if links[3].isActive}
            <Summarize />
        {/if}
    </div>
</div>

<style>
    .flex-container {
        display: flex;
        height: 100vh;
    }

    .content {
        flex: 1;
        overflow-y: auto;
        margin: 0;
        padding: 10px;
    }

    /* The navigation menu links */
    .sidenav {
        height: 100vh; /* Full-height: remove this if you want "auto" height */
        width: 15%; /* Set the width of the sidebar */
        position: relative; /* Fixed Sidebar (stay in place on scroll) */
        z-index: 1; /* Stay on top */
        top: 0; /* Stay at the top */
        left: 0;
        background-color: #1f1f1f; /* Black */
        overflow-x: hidden; /* Disable horizontal scroll */
        padding-top: 0px;
        font-family: 'arial';
    }

    /* The navigation menu links */
    .sidenav a {
        padding: 20px 8px;
        text-decoration: none;
        font-size: 20px;
        color: #fdfdfd;
        display: block;
        text-align: center;
        transition: font-size 0.3s ease-in-out;
        position: relative;
        line-height: 1;
        z-index: 1;
        position: relative;
    }

    /* When you mouse over the navigation links, change their color */
    .sidenav a:hover {
        color: #f1f1f1;
        font-weight: bold;
        background-color: #2f2f2f;
    }
    
    .sidenav a.active {
        color: #f1f1f1;
        background-color: #2f2f2f;
    }

    /* Note: For some reason, the red rectangle is larger by a bit*/
    .sidenav a::after {
        content: '';
        position: absolute;
        top: 50%;
        right: 0;
        width: 10px;
        height: 100%;
        background-color: var(--after-color); /* Use the CSS variable for the color */
        transform: translateY(-50%);
        opacity: 0;
        z-index: 2;
    }

    .sidenav a:hover::after {
        opacity: 1;
    }

    .sidenav a.active::after {
        opacity: 1;
    }


    /* On smaller screens, where height is less than 450px, change the style of the sidebar (less padding and a smaller font size) */
    @media screen and (max-height: 450px) {
        .sidenav {padding-top: 15px;}
        .sidenav a {font-size: 18px;}
    }
</style>