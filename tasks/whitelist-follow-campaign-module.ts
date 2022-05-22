import '@nomiclabs/hardhat-ethers';
import { hexlify, keccak256, RLP } from 'ethers/lib/utils';
import fs from 'fs';
import { task } from 'hardhat/config';
import {
  LensHub__factory,
} from '../typechain-types';
import { deployContract, waitForTx, getAddrs } from './helpers/utils';

task('whitelist-follow-campaign-module', 'whitelists the new follow module FollowCampaign from madfi').setAction(async ({}, hre) => {
  // Note that the use of these signers is a placeholder and is not meant to be used in
  // production.
  const ethers = hre.ethers;
  const networkName = hre.network.name;
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];
  const governance = accounts[1];
  const addrs = getAddrs();

  // Nonce management in case of deployment issues
  let deployerNonce = await ethers.provider.getTransactionCount(deployer.address);

  const hubProxyAddress = addrs['lensHub proxy'];

  // AFTER running `yarn deploy:docker` in other repo
  const MODULE_ADDRESS = addrs['FollowCampaignModule'];
  if (!MODULE_ADDRESS) throw new Error ('need to define MODULE_ADDRESS');

  // Whitelist the reference module
  const lensHub = LensHub__factory.connect(hubProxyAddress, governance);
  console.log(`\n\t-- Whitelisting Follow Module (at: ${MODULE_ADDRESS}) --`);
  await waitForTx(
    lensHub.whitelistFollowModule(MODULE_ADDRESS, true)
  );
});
