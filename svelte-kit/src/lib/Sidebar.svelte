<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
	import { authHandlers } from './stores/authStore';
	import { scriptSaveStatus } from './stores/scriptStore';
	import { get } from 'svelte/store';

    function activateLink(index: number, event: MouseEvent) {

        const status = get(scriptSaveStatus);

        if (!status || confirm('You have unsaved script changes that will be lost upon leaving this page. Are you sure you want to exit this tab?')) {
            links = links.map((link, i) => ({
                ...link,
                isActive: i === index
            }));

            const path = links[index].anchor;

            goto(path);
        } else {
            event.preventDefault();

            event.stopPropagation();
        }
    }

    // Creating the elements for the sidebar
    let links = [
        {name: 'Dashboard', color: '#FFD700', anchor: '/dashboard', isActive: false},
        {name: 'Brainstorm', color: '#990000', anchor: '/brainstorm', isActive: false},
        {name: 'Script', color: '#107500', anchor: '/script', isActive: false},
        {name: 'Summarize', color: '#003d75', anchor: '/summarize', isActive: false},
        {name: 'Log Out', color: '#ffffff', anchor: '/', isActive: false},
    ];

    // Activating the link that was clicked
    $: {
        const currentAnchor = $page.url.pathname;
        links = links.map(link => ({
            ...link,
            isActive: currentAnchor === link.anchor
        }));
    }

</script>

<div class="sidenav">
    <!-- Creating the sidebar elements with Svelte -->
    <!-- Use link.anchors here -->
    {#each links as link, index}
        {#if link.name === 'Log Out'}
            <!-- If the link is the logging out block -->
            <a 
                href={link.anchor}
                data-index={index} 
                style="--after-color: {link.color};"
                class:active={link.isActive}
                on:click={() => authHandlers.logout()}>
                {link.name}
            </a>
        {:else}
            <a 
                href={link.anchor}
                data-index={index} 
                style="--after-color: {link.color};"
                class:active={link.isActive}
                on:click|preventDefault={event => activateLink(index, event)}>
                {link.name}
            </a>
        {/if}
    {/each}
</div>

<style>

    /* The navigation menu links */
    .sidenav {
        height: 100vh; /* Full-height: remove this if you want "auto" height */
        background-color: #1f1f1f; /* Black */
        overflow-x: hidden; /* Disable horizontal scroll */
        font-family: 'arial';
        flex: 0 0 15%; /* The width is 15%, by default */
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