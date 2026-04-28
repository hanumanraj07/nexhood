import React from 'react';
import { N } from '../styles/theme';

const Footer = () => {
    return (
        <footer style={{
            padding: '60px 48px',
            backgroundColor: N.bg,
            boxShadow: '0 -4px 15px #b8bec7, 0 2px 6px #ffffff',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px'
        }}>
            <div style={{
                fontSize: '13px',
                fontWeight: 900,
                letterSpacing: '4px',
                color: N.teal,
                cursor: 'pointer'
            }}>
                NEXHOOD
            </div>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '28px',
                fontSize: '12px',
                fontWeight: 600,
                color: N.textMuted
            }}>
                {['Privacy Policy', 'Terms of Service', 'API Documentation', 'Data Methodology'].map((link) => (
                    <span key={link} style={{ cursor: 'pointer' }}>{link}</span>
                ))}
            </div>

            <div style={{
                fontSize: '11px',
                color: N.textMuted,
                letterSpacing: '0.5px',
                lineHeight: 1.5,
                maxWidth: '600px'
            }}>
                © 2026 NEXHOOD. THE DIGITAL CURATOR FOR REAL ESTATE INTELLIGENCE.
                ALL DATA PROVIDED IS FOR INFORMATION PURPOSES ONLY.
            </div>
        </footer>
    );
};

export default Footer;





