import AppKit

let image = NSImage(size: NSSize(width: 900, height: 1300))
image.lockFocus()
NSColor(calibratedRed: 0.96, green: 0.95, blue: 0.92, alpha: 1).setFill()
NSRect(x: 0, y: 0, width: 900, height: 1300).fill()
NSColor.white.setFill()
NSBezierPath(roundedRect: NSRect(x: 90, y: 55, width: 720, height: 1190), xRadius: 10, yRadius: 10).fill()
let para = NSMutableParagraphStyle()
para.alignment = .center
func line(_ text: String, _ y: CGFloat, _ size: CGFloat, bold: Bool = false) {
    let font = bold ? NSFont.monospacedSystemFont(ofSize: size, weight: .bold) : NSFont.monospacedSystemFont(ofSize: size, weight: .regular)
    (text as NSString).draw(in: NSRect(x: 130, y: y, width: 640, height: size * 1.8), withAttributes: [.font: font, .foregroundColor: NSColor.black, .paragraphStyle: para])
}
line("CAFE KUMBUK", 1100, 48, bold: true)
line("COLOMBO", 1045, 25)
line("RECEIPT", 950, 30, bold: true)
line("Nov 24, 2026", 900, 24)
line("----------------------------------", 830, 24)
line("Avocado toast              $14.00", 760, 27)
line("Cappuccino                  $6.50", 695, 27)
line("Banana pancakes             $8.00", 630, 27)
line("----------------------------------", 565, 24)
line("TOTAL                      $28.50", 490, 30, bold: true)
line("Thank you for visiting!", 350, 25)
line("SAMPLE RECEIPT", 230, 20)
image.unlockFocus()
guard let tiff = image.tiffRepresentation, let bitmap = NSBitmapImageRep(data: tiff), let png = bitmap.representation(using: .png, properties: [:]) else { fatalError("Could not render receipt") }
try png.write(to: URL(fileURLWithPath: "Cafe-Kumbuk-Receipt.png"))
