//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, v2.2.8-b130911.1802 
// See <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2023.01.06 at 03:30:00 PM EAT 
//


package co.ke.emtechhouse.eims.Finacle.filookups.currencies;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the generated package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class ObjectFactory {

    private final static QName _BodyCURRENCYNAME_QNAME = new QName("", "CURRENCY_NAME");
    private final static QName _BodyCURRENCYCODE_QNAME = new QName("", "CURRENCY_CODE");
    private final static QName _BodyCOUNTRYCODE_QNAME = new QName("", "COUNTRY_CODE");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: generated
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link CurrenciesBody }
     * 
     */
    public CurrenciesBody createBody() {
        return new CurrenciesBody();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "", name = "CURRENCY_NAME", scope = CurrenciesBody.class)
    public JAXBElement<String> createBodyCURRENCYNAME(String value) {
        return new JAXBElement<String>(_BodyCURRENCYNAME_QNAME, String.class, CurrenciesBody.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "", name = "CURRENCY_CODE", scope = CurrenciesBody.class)
    public JAXBElement<String> createBodyCURRENCYCODE(String value) {
        return new JAXBElement<String>(_BodyCURRENCYCODE_QNAME, String.class, CurrenciesBody.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "", name = "COUNTRY_CODE", scope = CurrenciesBody.class)
    public JAXBElement<String> createBodyCOUNTRYCODE(String value) {
        return new JAXBElement<String>(_BodyCOUNTRYCODE_QNAME, String.class, CurrenciesBody.class, value);
    }

}
