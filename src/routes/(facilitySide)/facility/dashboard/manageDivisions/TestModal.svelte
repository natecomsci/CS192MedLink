<script>
  let showPopup = false; // Controls the visibility of the popup
  let currentStep = 1; // Tracks the current step (1 or 2)
  let userInput = ""; // User input in step 1
  let confirmation = false; // User confirmation for step 2

  // Function to move to the next step
  function nextStep() {
    if (currentStep === 1) {
      currentStep = 2;
    } else {
      submitForm();
    }
  }

  // Function to move back to step 1
  function previousStep() {
    currentStep = 1;
  }

  // Function to handle form submission
  function submitForm() {
    // Do the form submission logic (e.g., API call, save data, etc.)
    alert("Form submitted with input: " + userInput);
    resetPopup();
  }

  // Reset popup
  function resetPopup() {
    currentStep = 1;
    userInput = "";
    showPopup = false;
  }
</script>


<div class="popup-overlay">
  <div class="popup-content">
      {#if currentStep === 1}
      <!-- Step 1: Enter Details -->
      <h2>Step 1: Enter Details</h2>
      <input
          type="text"
          bind:value={userInput}
          placeholder="Enter something..."
          class="input-field"
      />
      <button on:click={nextStep} disabled={!userInput}>Next</button>
      {:else if currentStep === 2}
      <!-- Step 2: Confirmation -->
      <h2>Step 2: Confirmation</h2>
      <p>You entered: <strong>{userInput}</strong></p>
      <div>
          <button on:click={previousStep}>Back</button>
          <button on:click={submitForm}>Confirm</button>
      </div>
      {/if}

      <button on:click={resetPopup} class="close-button">Close</button>
  </div>
</div>


<style>
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .popup-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    text-align: center;
  }

  .input-field {
    padding: 10px;
    width: 100%;
    margin-bottom: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  .close-button {
    background: red;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
  }

  button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }

  button {
    padding: 10px 15px;
    margin: 10px;
    border-radius: 4px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }

  button:hover:not(:disabled) {
    background-color: #45a049;
  }
</style>
