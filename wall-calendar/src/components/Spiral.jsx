import styles from './Spiral.module.css';

export default function Spiral() {
  return (
    <div className={styles.spiral}>
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className={styles.ring} />
      ))}
    </div>
  );
}
