<script lang="ts">
    import Sidebar from './Sidebar.svelte';

    // NOTE: A potential future change?
    // Maybe I should keep all text boxes with data in memory?
    // Instead of thewm just being erased when the user switches modes

    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    import { getAnalytics } from "firebase/analytics";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
    apiKey: "AIzaSyB7oIn_MSyFPirNdnBl5UFhFZBuDGPYZHI",
    authDomain: "automating-video-1685338158314.firebaseapp.com",
    projectId: "automating-video-1685338158314",
    storageBucket: "automating-video-1685338158314.appspot.com",
    messagingSenderId: "800196419306",
    appId: "1:800196419306:web:a0d4e10c0f978f78140193",
    measurementId: "G-BSG6Z6FQ77"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    
</script>

<div class="background">
    <Sidebar />
</div>

<style>
    .background {
        background-color: #2f2f2f;
        height: 100vh;
        margin: 0;
        padding: 0;
    }
</style>