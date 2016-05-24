from bokeh.document import Document
from bokeh.embed import file_html
from bokeh.models import Row, WidgetBox, Paragraph, Column
from bokeh.resources import INLINE
from bokeh.util.browser import view


def wb():
    text = """
    Bacon ipsum dolor amet hamburger brisket prosciutto, pork ball tip andouille
    sausage landjaeger filet mignon ribeye ground round. Jerky fatback cupim
    landjaeger meatball pork loin corned beef, frankfurter short ribs short loin
    bresaola capicola chuck kevin. Andouille biltong turkey, tail t-bone ribeye
    short loin tongue prosciutto kielbasa short ribs boudin. Swine beef ribs
    tri-tip filet mignon bresaola boudin beef meatball venison leberkas fatback
    strip steak landjaeger drumstick prosciutto.
    """
def wb():
    return WidgetBox(Paragraph(text=text), responsive='width_ar')

layout = Column(
    Row(wb(), wb(), responsive='width_ar'),
    Row(wb(), wb(), responsive='width_ar'),
    Row(wb(), responsive='width_ar'),
    Row(wb(), wb(), responsive='width_ar'),
    responsive='width_ar' # This width_ar is optional, all others are required.
)

doc = Document()
doc.add_root(layout)

if __name__ == "__main__":
    filename = "row_column_paragraph.html"
    with open(filename, "w") as f:
        f.write(file_html(doc, INLINE, "Rows and columns of paragraphs."))
    print("Wrote %s" % filename)
    view(filename)
