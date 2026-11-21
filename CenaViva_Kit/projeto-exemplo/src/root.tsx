import React from 'react';
import {Composition} from 'remotion';
import {CenaVivaDemo} from './video';
export const Root: React.FC = () => (
  <Composition id="CenaVivaDemo" component={CenaVivaDemo} width={1080} height={1920} fps={30} durationInFrames={240} />
);
