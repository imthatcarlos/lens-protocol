import '@nomiclabs/hardhat-ethers';
import { hexlify, keccak256, RLP } from 'ethers/lib/utils';
import fs from 'fs';
import { task } from 'hardhat/config';
import {
  LensHub__factory,
} from '../typechain-types';
import { deployContract, waitForTx, getAddrs } from './helpers/utils';

task('whitelist-sponsor-module', 'whitelists the new reference module SponsorModule from madfi').setAction(async ({}, hre) => {
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

  // AFTER running `npx hardhat deploy --network docker` in other repo
  const SPONSOR_MODULE_ADDRESS = '';
  if (!SPONSOR_MODULE_ADDRESS) throw new Error ('need to define SPONSOR_MODULE_ADDRESS');

  // Whitelist the reference module
  const lensHub = LensHub__factory.connect(hubProxyAddress, governance);
  console.log(`\n\t-- Whitelisting Reference Module (at: ${SPONSOR_MODULE_ADDRESS}) --`);
  await waitForTx(
    lensHub.whitelistReferenceModule(SPONSOR_MODULE_ADDRESS, true)
  );
});
