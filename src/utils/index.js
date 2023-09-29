import { ethers, toBigInt } from "ethers";
import { rpcUrlsMap, supportedChains } from "../constants";
import { crowdfundContractAddress } from "../constants/addresses";
import crowdFundAbi from "../constants/abis/crowdfund.json";

export const isSupportedChain = (chainId) =>
  supportedChains.includes(Number(chainId));

export const shortenAccount = (account) =>
  `${account.substring(0, 6)}...${account.substring(38)}`;

export const getReadOnlyProvider = (chainId) => {
  return new ethers.JsonRpcProvider(rpcUrlsMap[chainId]);
};

export const getContract = async (address, abi, provider, withWrite) => {
  let signer;
  if (withWrite) signer = await provider.getSigner();

  return new ethers.Contract(address, abi, withWrite ? signer : provider);
};

export const getContractWithProvider = (address, abi, provider) => {
  return new ethers.Contract(address, abi, provider);
};

export const getCrowdfundContract = async (provider, withWrite) => {
  return await getContract(
    crowdfundContractAddress,
    crowdFundAbi,
    provider,
    withWrite
  );
};

export const getCrowdfundContractWithProvider = (provider) => {
  return getContractWithProvider(
    crowdfundContractAddress,
    crowdFundAbi,
    provider
  );
};

export const formatDate = (time) => {
  // Convert the timestamp to milliseconds by multiplying it by 1000
  const date = new Date(time * 1000);

  // Get the year, month, day, hour, minute, second, and day of the week components
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based, so add 1 to get the correct month
  const day = date.getDate();
  const hour = date.getHours() % 12 || 12; // Convert to 12-hour format
  const minute = date.getMinutes();
  const second = date.getSeconds();

  // Create an array of month names to map the numeric month to its name
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Create an array of day names to map the numeric day to its name
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get the month name using the month value as an index in the monthNames array
  const monthName = monthNames[month - 1];

  // Get the day of the week using the day value as an index in the dayNames array
  const dayOfWeek = dayNames[date.getDay()];

  // Determine AM or PM
  const period = date.getHours() >= 12 ? "PM" : "AM";

  // Format the date string
  const formattedDate = `${dayOfWeek}, ${monthName} ${day}, ${year} ${hour}:${minute}:${second} ${period}`;

  return formattedDate;
};

export const calculateGasMargin = (value) =>
  (toBigInt(value) * toBigInt(120)) / toBigInt(100);
