---
title: "SVG Colour Wheel"
date: 2023-08-24T22:01:08+01:00
draft: false
mathjax: false
menu:
main:
parent: 'Posts'
name: "SVG Colour Wheel"
summary: "Making an SVG Colour Wheel"
image: "img/svg_colour_wheel.svg"
categories:
- Code
- Visualisation
---

SVG or Scalable Vector Graphics (SVG) is a web-friendly XML-based vector image format for defining graphics and logos which also supports interactivity and animation. I decided to create a colour wheel with SVG and document the different approaches that can be used.

## The result

{{< figure class="d-flex justify-content-center pb-4" src="/img/svg_colour_wheel.svg" width="500px" >}}

---
# A recap on SVG

### Basic shapes
{{< row >}}


{{< column  class="col-md-8 pb-2" >}}
{{< row >}}

{{% column class="col-md pb-2" %}}


SVG is best explained with a few examples. In this first example we define a basic SVG with four sub elements: A `rect`, `circle`, `ellipse` and `line`. The attributes passed to the elements define the position and shape properties; for example the rectangle starts at `x` position 10 (from the left) and `y` position 10 (down from the top). The units are relative to the `viewBox` defining a 100 unit square.
{{% /column %}}

{{% column class="col-md-12" %}}

```html
<svg width="100%" viewBox="0 0 100 100">
    <rect x="10" y="10" width="30" height="30"
        stroke="black" stroke-width="2" fill="rgb(252, 44, 8)" />
    <circle cx="75" cy="25" r="15"
        stroke="black" stroke-width="2" fill="rgb(252, 44, 8)" />
    <ellipse cx="25" cy="75" rx="15" ry="5"
        stroke="black" stroke-width="2" fill="rgb(252, 44, 8)" />
    <line x1="60" y1="60" x2="90" y2="90" stroke="black" stroke-width="2" />
</svg>
```
{{% /column %}}
{{< /row >}}

{{< /column >}}

{{< column  class="col-md-4 pb-3 d-flex align-items-center">}}
{{< svg_shapes_1 >}}
{{< /column >}}

{{< /row >}}


---



### Polygons and paths

{{< row >}}

{{< column  class="col-md-4 pb-3 d-flex align-items-center">}}
{{< svg_shapes_2 >}}
{{< /column >}}

{{< column  class="col-md-8 pb-2" >}}
{{< row >}}

{{% column class="col-md pb-2" %}}

In this second example there are two `polygon` elements and one of the more general `path` elements. The polygon creates a shape by specifying a collection of `x, y` coordinates. The `path` element is more complex. From MDN [docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths):

> The shape of a `path` element is defined by one parameter:`d`. The `d` attribute contains a series of commands and parameters used by those commands.

In this example we move (`M`) 20 units along and 70 units down without drawing. We then draw a curve (`q`) 60 units along and 0 up or down via a point 30 down and 30 along. The small `q` means the distances are relative to where we started the `q` command where as `Q` would have been from 0,0. Each command has an upper and a lower case variant for absolute/relative positions respectively.

{{% /column %}}

{{% column class="col-md-12" %}}

```html
<svg width="100%" viewBox="0 0 100 100">
    <polygon points="25,10 10,40 40,40" stroke="black" stroke-width="2" fill="rgb(145, 6, 89)" />
    <polygon points="62,20 70,12 80,12 88,20 88,30 80,38 70,38, 62,30"
        stroke="black" stroke-width="2" fill="rgb(145, 6, 89)" />
    <path d="M 20 70 q 30 30 60 0"
        stroke="black" stroke-width="2" fill="rgb(145, 6, 89)"/>
</svg>
```
{{% /column %}}
{{< /row >}}

{{< /column >}}

{{< /row >}}



---


### Arcs using paths
{{< row >}}


{{< column  class="col-md-8 pb-2" >}}
{{< row >}}

{{% column class="col-md-12 pb-2" %}}


In this example we demonstrate the complex arc command `A` that can be used in the `path` element.

`A rx ry x-rotation large-arg-flag sweep-flag x y`

For a given x-radius (rx) and y-radius (ry), there are two ellipses that can connect any two points (as long as they're within the radius of the circle). Along either of those circles, there are two possible paths that can be taken to connect the points—so in any situation, there are four possible arcs available. The `large-arg-flag` specifies whether to use a path which covers more than 180 degrees and the `sweep-flag` indicates whether to travel clockwise or anticlockwise.

{{% /column %}}

{{% column class="col-md-12" %}}

```html
<svg width="100%" viewBox="0 0 100 100">
    <path d="M 30 70 A 40 20 -45 1 1 70 30" stroke="rgb(252, 44, 8)" stroke-width="2" fill="none" />
    <path d="M 30 70 A 40 20 -45 1 0 70 30" stroke="rgb(13, 50, 144)" stroke-width="2" fill="none" />
    <path d="M 30 70 A 40 20 -45 0 1 70 30" stroke="rgb(88, 200, 0)" stroke-width="2" fill="none" />
    <path d="M 30 70 A 40 20 -45 0 0 70 30" stroke="rgb(252, 91, 9)" stroke-width="2" fill="none" />
</svg>
```
{{% /column %}}
{{< /row >}}

{{< /column >}}

{{< column  class="col-md-4 pb-3 d-flex align-items-center">}}
{{< svg_shapes_3 >}}
{{< /column >}}

{{< /row >}}



---
### Stroke dasharray


{{< row >}}

{{< column  class="col-md-4 pb-3 d-flex align-items-center">}}
{{< svg_shapes_4 >}}
{{< /column >}}

{{< column  class="col-md-8 pb-2" >}}
{{< row >}}

{{% column class="col-md pb-2" %}}

In this example the `stroke-dasharray` attribute is demonstrated creating dashed strokes. This effect can be used on a variety of shapes including `rect`, `circle`, `line`, `polyline` and `path` (amongst others).
The first two lines show `stroke-dasharray` of 2 and 16 respectively which are the units of the lines and spaces. The third and fourth lines have the same `stroke-dasharray` as the 2nd line but demonstrate two different `stroke-dashoffset` values of 8 and 16 respectively shifting the pattern along.

The last two examples demonstrate using `stroke-dasharray` on a path but the second shows that you can pass `stroke-dasharray` a list of numbers. In this case the values `"2 2 12 2 2"` apply to consecutive line and space segments and the pattern is repeated as required.

{{% /column %}}

{{% column class="col-md-12" %}}

```html
<svg width="100%" viewBox="0 0 100 100">
    <line x1="10" y1="10" x2="90" y2="10" stroke="black"
        stroke-width="1" stroke-dasharray="2" />
    <line x1="10" y1="14" x2="90" y2="14" stroke="black"
        stroke-width="1" stroke-dasharray="16" />
    <line x1="10" y1="18" x2="90" y2="18" stroke="black"
        stroke-width="1" stroke-dasharray="16" stroke-dashoffset="8" />
    <line x1="10" y1="22" x2="90" y2="22" stroke="black"
        stroke-width="1" stroke-dasharray="16" stroke-dashoffset="16" />
    <path d="M 10 45 c 0, -15 20,-15, 20,0 c 0, 15 20,15 20, 0
             c 0, -15 20,-15, 20,0 c 0, 15 20,15 20, 0"
        stroke="black" stroke-width="1" fill="none" stroke-dasharray="2" />
    <path d="M 10 75 c 0, -15 20,-15, 20,0 c 0, 15 20,15 20, 0
             c 0, -15 20,-15, 20,0 c 0, 15 20,15 20, 0"
        stroke="black" stroke-width="1" fill="none"
        stroke-dasharray="2 2 12 2 2" stroke-dashoffset="-4" />
</svg>

```
{{% /column %}}
{{< /row >}}

{{< /column >}}
{{< /row >}}


---
### Gradients
{{< row >}}


{{< column  class="col-md-8 pb-2" >}}
{{< row >}}

{{% column class="col-md-12 pb-2" %}}

As well as filling strokes and shapes with block color, SVG allows us to define color gradients. In this example we demonstrate a `linearGradient` and a `radialGradient`.

The `stop` elements define a `stop-color` at a certain percentage of the gradient.

{{% /column %}}

{{% column class="col-md-12" %}}

```html
<svg width="100%" viewBox="0 0 100 100">
    <linearGradient id="Gradient1">
        <stop offset="0%" stop-color="rgb(252, 254, 7)" />
        <stop offset="100%" stop-color="rgb(198, 6, 9)" />
    </linearGradient>
    <radialGradient id="Gradient2">
        <stop offset="0%" stop-color="rgb(88, 200, 0)" />
        <stop offset="100%" stop-color="rgb(13, 50, 144)" />
    </radialGradient>
    <circle cx="60" cy="40" r="30" fill="url(#Gradient2)" />
    <rect x="10" y="40" width="40" height="40" fill="url(#Gradient1)" />
</svg>

```
{{% /column %}}
{{< /row >}}

{{< /column >}}

{{< column  class="col-md-4 pb-3 d-flex align-items-center">}}
{{< svg_shapes_5 >}}
{{< /column >}}

{{< /row >}}






---
### Building the Spiral of colours: Take 1 arcs

{{< row >}}

{{< column  class="col-md-4 pb-3 d-flex align-items-center">}}
{{< svg_spiral_arcs >}}
{{< /column >}}

{{< column  class="col-md-8 pb-2" >}}
{{< row >}}

{{% column class="col-md pb-2" %}}

My first thought was to create a collection of arc `paths`. I calculated 12 equally spaced points around a circle of radius of 30 and then connected each point to the next using a new `arc`.

{{% /column %}}

{{% column class="col-md-12" %}}

```html
<svg width="100%" viewBox="0 0 100 100">
    <path d='M 50.0000 20.0000 A 30 30 0 0 1 65.0000 24.0192'
        stroke='rgb(252, 254, 7)' stroke-width='30' />
    <path d='M 65.0000 24.0192 A 30 30 0 0 1 75.9808 35.0000'
        stroke='rgb(252, 143, 9)' stroke-width='30' />
    <path d='M 75.9808 35.0000 A 30 30 0 0 1 80.0000 50.0000'
        stroke='rgb(252, 91, 9)' stroke-width='30' />
    <path d='M 80.0000 50.0000 A 30 30 0 0 1 75.9808 65.0000'
        stroke='rgb(252, 44, 8)' stroke-width='30' />
    <path d='M 75.9808 65.0000 A 30 30 0 0 1 65.0000 75.9808'
        stroke='rgb(198, 6, 9)' stroke-width='30' />
    <path d='M 65.0000 75.9808 A 30 30 0 0 1 50.0000 80.0000'
        stroke='rgb(145, 6, 89)' stroke-width='30' />
    <path d='M 50.0000 80.0000 A 30 30 0 0 1 35.0000 75.9808'
        stroke='rgb(89, 6, 90)' stroke-width='30' />
    <path d='M 35.0000 75.9808 A 30 30 0 0 1 24.0192 65.0000'
        stroke='rgb(8, 6, 88)' stroke-width='30' />
    <path d='M 24.0192 65.0000 A 30 30 0 0 1 20.0000 50.0000'
        stroke='rgb(13, 50, 144)' stroke-width='30' />
    <path d='M 20.0000 50.0000 A 30 30 0 0 1 24.0192 35.0000'
        stroke='rgb(8, 91, 90)' stroke-width='30' />
    <path d='M 24.0192 35.0000 A 30 30 0 0 1 35.0000 24.0192'
        stroke='rgb(47, 141, 11)' stroke-width='30' />
    <path d='M 35.0000 24.0192 A 30 30 0 0 1 50.0000 20.0000'
        stroke='rgb(88, 200, 0)' stroke-width='30' />
</svg>

```
{{% /column %}}
{{< /row >}}

{{< /column >}}
{{< /row >}}


---
### Building the Spiral of colours: Take 2 circles
{{< row >}}


{{< column  class="col-md-8 pb-2" >}}
{{< row >}}

{{% column class="col-md-12 pb-2" %}}

Despite the `arc` approach working I realised that I could use 12 circle strokes with `stroke-dasharray` such that only
and arc of the circle is displayed. Then I used the `transform` `rotate` command about the centre of the circle to rotate
each segment to form the spiral.

{{% /column %}}

{{% column class="col-md-12" %}}

```html
<svg width="100%" viewBox="0 0 100 100">
    <circle r="30" cx="50" cy="50" stroke="rgb(252, 254, 7)"
        transform="rotate(-90,50,50)"
        stroke-dasharray="15.7 188.5" stroke-width="12" fill="none" />
    <circle r="30" cx="50" cy="50" stroke="rgb(252, 143, 9)"
        transform="rotate(-60,50,50)"
        stroke-dasharray="15.7 188.5" stroke-width="12" fill="none"/>
    <circle r="30" cx="50" cy="50" stroke="rgb(252, 91, 9)"
        transform="rotate(-30,50,50)"
        stroke-dasharray="15.7 188.5" stroke-width="12" fill="none"/>
    <circle r="30" cx="50" cy="50" stroke="rgb(252, 44, 8)"
        transform="rotate(0,50,50)"
        stroke-dasharray="15.7 188.5" stroke-width="12" fill="none"/>
    <circle r="30" cx="50" cy="50" stroke="rgb(198, 6, 9)"
        transform="rotate(30,50,50)"
        stroke-dasharray="15.7 188.5" stroke-width="12" fill="none"/>
    <circle r="30" cx="50" cy="50" stroke="rgb(145, 6, 89)"
        transform="rotate(60,50,50)"
        stroke-dasharray="15.7 188.5" stroke-width="12" fill="none"/>
    <circle r="30" cx="50" cy="50" stroke="rgb(89, 6, 90)"
        transform="rotate(90,50,50)"
        stroke-dasharray="15.7 188.5" stroke-width="12" fill="none"/>
    <circle r="30" cx="50" cy="50" stroke="rgb(8, 6, 88)"
        transform="rotate(120,50,50)"
        stroke-dasharray="15.7 188.5" stroke-width="12" fill="none"/>
    <circle r="30" cx="50" cy="50" stroke="rgb(13, 50, 144)"
        transform="rotate(150,50,50)"
        stroke-dasharray="15.7 188.5" stroke-width="12" fill="none"/>
    <circle r="30" cx="50" cy="50" stroke="rgb(8, 91, 90)"
        transform="rotate(180,50,50)"
        stroke-dasharray="15.7 188.5" stroke-width="12" fill="none"/>
    <circle r="30" cx="50" cy="50" stroke="rgb(47, 141, 11)"
        transform="rotate(210,50,50)"
        stroke-dasharray="15.7 188.5" stroke-width="12" fill="none"/>
    <circle r="30" cx="50" cy="50" stroke="rgb(88, 200, 0)"
        transform="rotate(240,50,50)"
        stroke-dasharray="15.7 188.5" stroke-width="12" fill="none"/>
</svg>

```
{{% /column %}}
{{< /row >}}

{{< /column >}}

{{< column  class="col-md-4 pb-3 d-flex align-items-center">}}
{{< svg_spiral_circles >}}
{{< /column >}}

{{< /row >}}


---
### Building the Spiral of colours: Take 3 conic-gradient

{{< row >}}

{{< column  class="col-md-4 pb-3 d-flex align-items-center">}}

{{< svg_spiral_conic_gradient >}}

{{< /column >}}

{{< column  class="col-md-8 pb-2" >}}
{{< row >}}

{{% column class="col-md pb-2" %}}

This third and final spiral uses the `conic-gradient` css property to define a gradient varying around a circle based on the angle. However this gradient is only available on HTML `div`s so I had to use a foreign object to define a square with the right colours. I then use a white circle stroke with the right shape as a mask on the coloured div. You can click the shape to toggle the `mask`.

{{% /column %}}

{{% column class="col-md-12" %}}

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <foreignObject width="100" height="100" mask="url(#circleMask)">
        <div
            style="
            height: 100;
            background: conic-gradient(from 0deg at 50% 50%,
            rgb(252, 254, 7)   0.0deg 30.0deg,
            rgb(252, 143, 9)   30.0deg 60.0deg,
            rgb(252, 91, 9)    60.0deg 90.0deg,
            rgb(252, 44, 8)    90.0deg 120.0deg,
            rgb(198, 6, 9)     120.0deg 150.0deg,
            rgb(145, 6, 89)    150.0deg 180.0deg,
            rgb(89, 6, 90)     180.0deg 210.0deg,
            rgb(8, 6, 88)      210.0deg 240.0deg,
            rgb(13, 50, 144)   240.0deg 270.0deg,
            rgb(8, 91, 90)     270.0deg 300.0deg,
            rgb(47, 141, 11)   300.0deg 330.0deg,
            rgb(88, 200, 0)    330.0deg 360.0deg
            );"></div>
    </foreignObject>
    <defs>
        <mask id="circleMask">
            <circle r="30" cx="50" cy="50" stroke-width="12" stroke="30" />
        </mask>
    </defs>
</svg>


```
{{% /column %}}
{{< /row >}}

{{< /column >}}
{{< /row >}}

### Animation: click to play/pause
{{< svg_spiral_conic_animated >}}
