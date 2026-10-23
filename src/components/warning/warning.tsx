import styles from './warning.module.css'

export default function ModuleWarning() {

    return (
        <>
            <div className={styles.attendanceStats}>
                <div className={styles.warningMessage}>
                    <div className={styles.warningIcon}>⚠</div>
                    <div className={styles.warningText}>
                        Module misconfigured. Check origin and destiny school configuration!
                    </div>
                </div>
            </div>
        </>
    )

}