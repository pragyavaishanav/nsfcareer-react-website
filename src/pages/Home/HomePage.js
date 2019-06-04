import React, { Fragment } from "react";

const HomePage = () => (
  <Fragment>

		<h1 class="topspace">CAREER: Multiscale Modeling of Axonal Fiber Bundles in the Brain</h1>
		<h2 class="topspace2">NSF CAREER Project, PI: Reuben H. Kraft, Ph.D., Award Number: 1846059</h2>

		<p class="text1 topspace2"> Brain injuries are a significant health concern
for civilian and military populations.Many of these injuries result from damage
to the axons, the long extensions of neurons that allow communication between brain cells.
This Faculty Early Career Development Program (CAREER) project will contribute to the understanding
of brain trauma by developing advanced computer models that link neuroimaging results,
biomechanical assessments, and computational modeling of the brain.Specifically, this project
will develop and validate a model of axonal damage using controlled experimental methods.
More broadly, the continued pursuit of the development and validation of numerical diagnostics
 is anticipated to advance the emerging field of computational medicine.This project will integrate
education and outreach activities with the research, including a mobile "NSF Sideline Science"
curriculum that teaches and promotes awareness of brain science and computational medicine
for K-12 students and the general public.In addition, a systematic multiyear study will examine
 the effectiveness of a new junior-level computational tools course on improving undergraduate
 performance in other core engineering and design courses.Also, a graduate - level, semiannual
colloquium will enhance students ' understanding of the power of advanced cyberinfrastructures to
 solve diverse problems in science and engineering.

 < /p>
	<p class="text1 topspace2">
Diffuse axonal injury is a common pathology associated with traumatic brain injury in which
deformation of axonal cells leads to rupture and axonal degeneration;
yet, there remain difficulties with interpreting the degree of injury based on imaging of
structural changes.Axonal fiber tracts formed from organized collections of neural cells can
be visualized using magnetic resonance diffusion imaging.These images will be used in conjunction
 with a new multiscale embedded finite element technique that models the complex nature of
axonal tracts in the brain.The research objective is to develop a validated multiscale
computational method that explicitly includes axonal fiber tracts from diffusion-weighted
 neuroimaging and predicts primary and secondary effects of axonal injury over time. The
central hypothesis is that changes in diffusion tensor imaging can be fully explained through
 the use of computational predictions of axonal fiber bundle strain.This project will develop
a new computational tool, or "Digital Brain," that leverages advanced cyberinfrastructures and
expands capabilities in the emerging field of computational medicine.This will be accomplished
through the implementation of a new multiscale embedded finite element technique to model the
 complex nature of axonal tracts in the brain as well as a time-dependent, inelastic damage model
for the axonal fiber tracts and surrounding extra cellular matrix.Both will be validated using
 controlled experimental methods.The model will extend from the molecular to the organ level to
study axonal injury mechanisms.Single cell-to-fiber tract coupling will enable the transfer
 of structural and functional information across scales.This multiscale modeling will thus provide
 insight into primary and secondary Wallerian injury cascades associated with brain injury.
 < /p>

 <div class="row">
   <div class="column nsf-img left">
     <img src="/img/NSF_4-Color_bitmap_Logo-sm.png" />
   </div>
   <div class="column  right">
     <img src="/img/PSU_ENG_RGB_287_284-01_1.png" />
   </div>
 </div>

  </Fragment>
);

export default HomePage;
