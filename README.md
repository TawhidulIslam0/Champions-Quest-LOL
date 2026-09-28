# ⚔️ League of Legends Guessing Game

A high-stakes "Champion Quest" where you must test your knowledge of all *League of Legends* champions. Can you identify them all?

---

## 🏆 The Challenge

The ultimate test of *League of Legends* knowledge. In this game, you must correctly identify champions based on their unique gameplay traits.

*   **Logic-Based Deduction**: Unlike random guessing, you must use trait feedback to narrow down your selection.
*   **Trait Comparison**: Face the challenge of matching gender, lane, genre, resource, attack type, region, and release year.
*   **Master the Rift**: Correctly identify the target champion to unlock the victory screen.
*   **Persistent Progress**: Your successful streak and guesses are tracked during your session.

---

## ⚡ Features

*   **Smart Search**: An integrated, autocomplete-enabled search bar allows you to quickly find and guess from the full roster of champions.
*   **Color-Coded Feedback**: 
    *   🟩 **Correct**: You've nailed the trait.
    *   🟨 **Partial**: Your guess shares overlapping traits.
    *   🟥 **Incorrect**: The trait doesn't match the target.
*   **Advanced Clues**: Use the **Year** column's directional arrows (▲/▼) to deduce if a champion was released before or after your guess.
*   **Clean, Focused UI**: A minimalist, high-intensity dark interface inspired by the *League of Legends* aesthetic.

---

## 🛠️ Technologies Used

*   **React**: Built with functional components and hooks for a fluid, responsive experience.
*   **Local Data**: Powered by a structured JSON dataset containing traits for all champions.
*   **Vite**: Fast development environment and optimized production builds.

---

## 🎮 How to Play

1.  **Start the Quest**: A mystery champion is randomly selected the moment the game loads.
2.  **Make a Guess**: Type the name of a champion into the input field and press **Enter**.
3.  **Analyze**: Use the grid feedback to evaluate your guess against the target.
4.  **Reset**: Use the **Reset** button at any time to start a fresh quest.

---

## 🚀 Installation

To run this project locally:

```bash
# Clone the repository
git clone [https://github.com/TawhidulIslam0/Champion-Quest](https://github.com/TawhidulIslam0/Champion-Quest)

# Install dependencies
npm install

# Start the development server
npm run dev
