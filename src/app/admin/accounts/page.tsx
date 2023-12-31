"use client";

import styles from "./page.module.css";
import { MdRefresh } from "react-icons/md";
import { CiFilter } from "react-icons/ci";
import SearchBar from "@/components/SearchBar.tsx/SearchBar";
import React, { useState } from "react";
import FilterModal from "./components/FilterModal";
import { modalHandler } from "@/components/Modal/BaseModal";
import UserInfoModal from "./components/UserInfoModal";


export interface Account {
  username: string;
  date: Date;
  rank: string;
  phoneNumber: string;
  country: string;
  city: string;
  address: string;
}

const accounts: Account[] = [
  {
    username: "Dom",
    date: new Date(),
    rank: "Super Admin",
    phoneNumber: "(+63) 986 255 9923",
    country: "Philippines",
    city: "Manila",
    address: "123 Taft Ave.",
  },
  {
    username: "BrOdin",
    date: new Date(),
    rank: "Member",
    phoneNumber: "(+63) 986 255 9923",
    country: "Philippines",
    city: "Manila",
    address: "123 Taft Ave.",
  },
  {
    username: "Kyle",
    date: new Date(),
    rank: "Member",
    phoneNumber: "(+63) 986 255 9923",
    country: "Philippines",
    city: "Manila",
    address: "123 Taft Ave.",
  },
  {
    username: "Lars",
    date: new Date(),
    rank: "Admin",
    phoneNumber: "(+63) 986 255 9923",
    country: "Philippines",
    city: "Manila",
    address: "123 Taft Ave.",
  },
  {
    username: "Sidney",
    date: new Date(),
    rank: "Member",
    phoneNumber: "(+63) 986 255 9923",
    country: "Philippines",
    city: "Manila",
    address: "123 Taft Ave.",
  },
];

const TableRow: React.FC<{
 account:Account
}> = ({ account }) => {
  const formatDate = (date: Date) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${
      months[Number(month) - 1]
    } ${day}, ${year} at ${hours}:${minutes}:${seconds}`;
  };

  const isUserInfoModalOpen = useState(false);

  return (
    <div className={styles.table_row}>
      <UserInfoModal state={isUserInfoModalOpen} user={account}/>
      <h1 className={styles.username_column}>{account.username}</h1>
      <h1 className={styles.date_column}>{formatDate(account.date)}</h1>
      <h1 className={styles.rank_column}>{account.rank}</h1>
      <button className={styles.view_info_btn} onClick={modalHandler(isUserInfoModalOpen)}>View Info</button>

      {account.rank === "Admin" && (
        <button className={styles.give_admin_btn}>Give Admin</button>
      )}
      {account.rank === "Member" && (
        <button className={styles.remove_admin_btn}>Remove Admin</button>
      )}
    </div>
  );
};



export default function AccountPage() {
  const [searchValue, setSearchValue] = useState("");
  const [filteredAccounts, setFilteredAccounts] = useState(accounts);
  const isFilterModalOpen = useState(false);

  const handleInputChange = (value: string) => {
    setSearchValue(value);

    const filtered = accounts.filter((account) =>
      account.username.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAccounts(filtered);
  };

 

  return (
    <div className={styles.main_container}>
      <FilterModal onSubmit={console.log} state={isFilterModalOpen} />


      <div className={styles.inner_container}>
        <div className={styles.header_container}>
          <h1 className={styles.header_text}>Account Management</h1>

          <SearchBar onInputChange={handleInputChange} />

          <div className={styles.buttons_container}>
            <div className={styles.button_container} onClick={modalHandler(isFilterModalOpen)}>
              <CiFilter className={styles.button} />
            </div>

            <div className={styles.button_container}>
              <MdRefresh className={styles.button} />
            </div>
          </div>
        </div>

        <div className={styles.table}>
          <div className={styles.table_header_container}>
            <h1 className={styles.username_column}>Username</h1>
            <h1 className={styles.date_column}>Date Registered</h1>
            <h1 className={styles.rank_column}>Rank</h1>
            <h1 className={styles.actions_column}>Actions</h1>
          </div>

          {filteredAccounts.map((account, index) => (
            <TableRow key={index}
              account={account}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
