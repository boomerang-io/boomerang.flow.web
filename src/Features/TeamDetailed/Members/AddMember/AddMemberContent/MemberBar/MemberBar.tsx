import React from "react";
import { CloseOutline32 } from "@carbon/icons-react";
import styles from "./MemberBar.module.scss";

export default function MemberBar({
  addUser,
  id,
  email,
  name,
  removeUser,
}: {
  addUser: Function | null;
  id: string;
  email: string;
  name: string;
  removeUser: Function | null;
}) {
  return (
    <li key={id}>
      <button
        className={styles.container}
        onClick={addUser ? () => addUser(id) : removeUser ? () => removeUser(id) : () => {}}
        type="button"
      >
        <div className={styles.userRow}>
          <div className={styles.textContainer}>
            <p className={styles.name}>{name}</p>
            <p className={styles.email}>{email}</p>
          </div>
        </div>
        {removeUser && (
          <CloseOutline32 className={styles.closeIcon} alt="remove user" data-testid="remove-user-button" />
        )}
      </button>
    </li>
  );
}
