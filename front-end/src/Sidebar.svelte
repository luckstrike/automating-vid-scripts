<script>
    let links = [
        {name: 'Brainstorm', color: '#990000'},
        {name: 'Script', color: '#107500'},
        {name: 'Summarize', color: '#003d75'}
    ];
</script>

<div class="sidenav">
    {#each links as link, index}
        <!-- Set inline style for the ::after pseudo-element -->
        <a href="#" data-index={index} style="--after-color: {link.color};">{link.name}</a>
    {/each}
</div>

<style>
    /* The navigation menu links */
    .sidenav {
        height: 100%; /* Full-height: remove this if you want "auto" height */
        width: 300px; /* Set the width of the sidebar */
        position: fixed; /* Fixed Sidebar (stay in place on scroll) */
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
        padding: 20px 8px 20px 16px;
        text-decoration: none;
        font-size: 20px;
        color: #fdfdfd;
        display: block;
        text-align: center;
        transition: font-size 0.3s ease-in-out;
        position: relative;
        line-height: 1;
    }

    /* When you mouse over the navigation links, change their color */
    .sidenav a:hover {
        color: #f1f1f1;
        font-weight: bold;
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
    }

    /* On smaller screens, where height is less than 450px, change the style of the sidebar (less padding and a smaller font size) */
    @media screen and (max-height: 450px) {
        .sidenav {padding-top: 15px;}
        .sidenav a {font-size: 18px;}
    }
</style>