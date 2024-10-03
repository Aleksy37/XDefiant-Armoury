import React, { createContext, useContext, useState, useCallback } from 'react';

const WeaponContext = createContext();

const PERCENTAGE_BASED_STATS = [
  'rateOfFire', 'adsTime', 'sprintToFire', 'moveSpeed', 'adsMoveSpeed', 
  'reloadTime', 'recoil', 'damageRanges'
];

export const WeaponProvider = ({ children }) => {
    const [selectedWeapon, setSelectedWeapon] = useState(null);
    const [attachments, setAttachments] = useState([]);

    const updateWeaponStats = useCallback((weapon, attachmentList) => {
        if (!weapon) return null;

        const updatedWeapon = JSON.parse(JSON.stringify(weapon)); // Deep clone
        const baseWeapon = JSON.parse(JSON.stringify(weapon)); // Keep a copy of base stats

        attachmentList.forEach(attachment => {
            Object.entries(attachment.effects).forEach(([stat, effect]) => {
                if (PERCENTAGE_BASED_STATS.includes(stat)) {
                    if (typeof updatedWeapon[stat] === 'number') {
                        // Handle flat stats
                        const percentageChange = effect / 100;
                        updatedWeapon[stat] = baseWeapon[stat] * (1 + percentageChange);
                    } else if (typeof updatedWeapon[stat] === 'object') {
                        // Handle nested stats (recoil, damageRanges)
                        Object.keys(updatedWeapon[stat]).forEach(subStat => {
                            if (effect[subStat]) {
                                const percentageChange = effect[subStat] / 100;
                                updatedWeapon[stat][subStat] = baseWeapon[stat][subStat] * (1 + percentageChange);
                            }
                        });
                    }
                } else if (stat === 'magSize') {
                    // Handle magSize as a flat addition/subtraction
                    updatedWeapon[stat] += effect;
                }
                // Add handling for other stats here if needed
            });
        });

        // Round numerical values
        Object.keys(updatedWeapon).forEach(key => {
            if (typeof updatedWeapon[key] === 'number') {
                updatedWeapon[key] = Math.round(updatedWeapon[key] * 100) / 100;
            } else if (typeof updatedWeapon[key] === 'object' && key !== 'attachments') {
                Object.keys(updatedWeapon[key]).forEach(subKey => {
                    if (typeof updatedWeapon[key][subKey] === 'number') {
                        updatedWeapon[key][subKey] = Math.round(updatedWeapon[key][subKey] * 100) / 100;
                    }
                });
            }
        });

        return updatedWeapon;
    }, []);

    const addAttachment = useCallback((attachment) => {
        setAttachments(prev => [...prev, attachment]);
    }, []);

    const removeAttachment = useCallback((attachmentId) => {
        setAttachments(prev => prev.filter(a => a._id !== attachmentId));
    }, []);

    const value = {
        selectedWeapon,
        setSelectedWeapon,
        attachments,
        addAttachment,
        removeAttachment,
        getCurrentWeapon: useCallback(() => updateWeaponStats(selectedWeapon, attachments), [selectedWeapon, attachments, updateWeaponStats])
    };

    return (
        <WeaponContext.Provider value={value}>
            {children}
        </WeaponContext.Provider>
    );
};

export const useWeapon = () => useContext(WeaponContext);