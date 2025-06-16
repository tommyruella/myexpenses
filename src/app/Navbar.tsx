import React from "react";
import styled from "styled-components";

const NavbarContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  isolation: isolate;
`;

const NavbarWrapper = styled.nav`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, sans-serif;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 0, 0, 0.08) 15%,
      rgba(0, 0, 0, 0.08) 85%,
      transparent
    );
  }
`;

const LogoWrapper = styled.span`
  position: relative;
  display: inline-block;
  padding: 0 8px;

  &::before {
    content: "";
    position: absolute;
    z-index: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90px;
    height: 40px;
    pointer-events: none;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    background: rgba(255, 255, 255, 0.4);
    border-radius: 20px;
    
    /* Maschera di dissolvenza migliorata per un effetto seamless */
    mask-image: radial-gradient(
      ellipse at center,
      black 40%, /* Il nero solido inizia a sfumare prima */
      rgba(0, 0, 0, 0.5) 70%, /* Punto di semi-trasparenza per una transizione più morbida */
      transparent 100%
    );
    -webkit-mask-image: radial-gradient(
      ellipse at center,
      black 40%,
      rgba(0, 0, 0, 0.5) 70%,
      transparent 100%
    );
    
    /* Leggera ombra per transizione più morbida */
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.03);
  }
`;

const LogoText = styled.span`
  position: relative;
  font-weight: 800;
  font-size: 22px;
  letter-spacing: -1px;
  color: #181818;
  z-index: 1;
`;

const RightText = styled.span`
  font-size: 15px;
  color: #888;
  font-weight: 500;
`;

export default function Navbar() {
  return (
    <NavbarContainer>
      <NavbarWrapper>
        <LogoWrapper>
          <LogoText>tommytegamino</LogoText>
        </LogoWrapper>
        <RightText>dashboard</RightText>
      </NavbarWrapper>
    </NavbarContainer>
  );
}