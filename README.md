# Profile Creator

This Dapp allows you to:

1. create your profile
2. update your profile.

The dapp is a single page dapp that ensures that a user have connected a wallet before gaining access to the dapp.

The dapp can be further enhanced but all the major functionality listed above works very well.

## Running the Dapp

To run this dapp, open the project directory and run the following from a terminal:

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost.
Typically at <http://localhost:3000/>

Happy Viewing.
